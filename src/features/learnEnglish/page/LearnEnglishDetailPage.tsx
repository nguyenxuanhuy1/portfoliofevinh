import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftOutlined,
  GlobalOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { Modal, message } from 'antd'

import { useLearnTopicByIdQuery } from '../../../hooks/useLearnTopicQuery'
import learnTopicService from '../../admin/topic/service/learnTopicService'
import Skeleton from '../../../components/ui/Skeleton'
import type { ExerciseType, GradingResult } from '../../../types/LearnEnglish'
import '../style/index.scss'

export default function LearnEnglishDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { topic, loading } = useLearnTopicByIdQuery(id)

  const [activeTab, setActiveTab] = useState<'wizard' | 'token'>('wizard')
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<Array<{ type: ExerciseType; answers: Record<string, string> }>>([])
  
  const [status, setStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>('NOT_STARTED')
  const [score, setScore] = useState<number | null>(null)
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dots, setDots] = useState('...')
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Cycle dots for loading animation
  useEffect(() => {
    if (!isSubmitting) return

    setDots('.')
    let count = 1
    const interval = setInterval(() => {
      count = (count % 3) + 1
      setDots('.'.repeat(count))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [isSubmitting])

  // Drawer dictionary states
  const [dictOpen, setDictOpen] = useState(false)
  const [dictQuery, setDictQuery] = useState('')
  const [dictResult, setDictResult] = useState<{ word: string; meaning: string; example?: string } | null>(null)

  // Hints toggler state
  const [shownHints, setShownHints] = useState<Record<string, boolean>>({})

  // Token management states
  const [newToken, setNewToken] = useState('')
  const [tokens, setTokens] = useState<Array<{ id: string; value: string }>>(() => 
    JSON.parse(localStorage.getItem('learn_tokens') || '[]')
  )

  // Initialize progress from localStorage
  useEffect(() => {
    if (!id) return
    const raw = localStorage.getItem(`learn_progress_${id}`)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setStatus(parsed.status || 'NOT_STARTED')
        setScore(parsed.score ?? null)
        setGradingResult(parsed.gradingResult || null)
        if (parsed.answers && Array.isArray(parsed.answers)) {
          setUserAnswers(parsed.answers)
        }
        
        if (parsed.status === 'COMPLETED') {
          setActiveTab('wizard')
          // Auto go to last step (Practice/Grading review step)
        }
      } catch (err) {
        console.error('Lỗi load progress từ localStorage:', err)
      }
    }
  }, [id])

  // Dictionary lookup handler (matches JS quick translate in user design)
  const handleDictSearch = (val: string) => {
    setDictQuery(val)
    if (!val.trim() || !topic) {
      setDictResult(null)
      return
    }
    const cleanQuery = val.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
    const dataObj = typeof topic.data === 'string' ? JSON.parse(topic.data) : topic.data
    const vocabList = dataObj?.vocabulary || []
    
    const matchedVocab = vocabList.find(
      (v: any) => {
        const wordLower = v.word?.toLowerCase() || ''
        return wordLower === cleanQuery || cleanQuery.includes(wordLower) || wordLower.includes(cleanQuery)
      }
    )

    if (matchedVocab) {
      setDictResult({
        word: matchedVocab.word,
        meaning: matchedVocab.vietnamese,
        example: matchedVocab.example || undefined
      })
    } else {
      setDictResult(null)
    }
  }

  // Answer modification handler
  const handleAnswerChange = (type: ExerciseType, questionId: number, value: string) => {
    if (status === 'COMPLETED') return

    setUserAnswers((prev) => {
      const existingIdx = prev.findIndex((item) => item.type === type)
      let newAnswers = [...prev]

      if (existingIdx > -1) {
        newAnswers[existingIdx] = {
          ...newAnswers[existingIdx],
          answers: {
            ...newAnswers[existingIdx].answers,
            [questionId.toString()]: value
          }
        }
      } else {
        newAnswers.push({
          type,
          answers: { [questionId.toString()]: value }
        })
      }

      setStatus('IN_PROGRESS')
      localStorage.setItem(`learn_progress_${id}`, JSON.stringify({
        topicId: id,
        status: 'IN_PROGRESS',
        answers: newAnswers,
        score: null,
        gradingResult: null
      }))

      return newAnswers
    })
  }

  const getAnswerValue = (type: ExerciseType, questionId: number): string => {
    const section = userAnswers.find((item) => item.type === type)
    return section?.answers[questionId.toString()] || ''
  }

  // Save history helper
  const saveToHistory = (finalScore: number) => {
    if (!topic || !id) return
    const historyRaw = localStorage.getItem('learn_history')
    let historyList = []
    
    if (historyRaw) {
      try {
        historyList = JSON.parse(historyRaw)
      } catch {}
    }
    
    const newRecord = {
      id: Math.random().toString(36).substring(2, 9),
      topicId: id,
      topicName: topic.name,
      submittedAt: new Date().toISOString(),
      score: finalScore
    }
    
    historyList.push(newRecord)
    localStorage.setItem('learn_history', JSON.stringify(historyList))
  }

  // Submit and grade answers
  const handleSubmitGrading = async () => {
    if (!id || !topic) return
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const dataObj = typeof topic.data === 'string' ? JSON.parse(topic.data) : topic.data
      const finalAnswers = (dataObj.exercises || []).map((ex) => {
        const existing = userAnswers.find((item) => item.type === ex.type)
        const qAnswers: Record<string, string> = {}
        
        ex.questions.forEach((q: any) => {
          const qId = q.id.toString()
          qAnswers[qId] = existing?.answers[qId] || ''
        })

        return {
          type: ex.type,
          answers: qAnswers
        }
      })

      const result = await learnTopicService.grade(id, finalAnswers)
      
      setGradingResult(result)
      setScore(result.total_score)
      setStatus('COMPLETED')

      localStorage.setItem(`learn_progress_${id}`, JSON.stringify({
        topicId: id,
        status: 'COMPLETED',
        answers: finalAnswers,
        score: result.total_score,
        gradingResult: result
      }))

      saveToHistory(result.total_score)
      message.success('Bài làm đã được chấm điểm tự động thành công!')
    } catch (err: any) {
      console.error('Lỗi chấm điểm:', err)
      setSubmitError(err.message || 'Lỗi kết nối máy chủ AI.')
      message.error('Chấm điểm thất bại, vui lòng kiểm tra API Key.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetProgress = () => {
    Modal.confirm({
      title: 'Làm lại bài học từ đầu',
      content: 'Bạn có chắc chắn muốn xóa toàn bộ tiến trình học và câu trả lời cũ của chủ đề này để làm lại từ đầu?',
      okText: 'Làm lại',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        if (id) {
          localStorage.removeItem(`learn_progress_${id}`)
        }
        setUserAnswers([])
        setStatus('NOT_STARTED')
        setScore(null)
        setGradingResult(null)
        setSubmitError(null)
        setCurrentStep(0)
        setActiveTab('wizard')
        setShownHints({})
        message.success('Đã reset bài làm thành công!')
      }
    })
  }

  if (loading) {
    return (
      <div className="learn-english" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
        <div className="phone" style={{ border: 'none' }}>
          <div style={{ padding: '24px' }}>
            <Skeleton variant="text" width="60%" height="24px" style={{ marginBottom: '12px' }} />
            <Skeleton variant="rect" height="180px" borderRadius="12px" style={{ marginBottom: '24px' }} />
            <Skeleton variant="text" width="90%" height="16px" style={{ marginBottom: '12px' }} />
            <Skeleton variant="text" width="80%" height="16px" style={{ marginBottom: '48px' }} />
            <Skeleton variant="rect" height="48px" borderRadius="8px" />
          </div>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="learn-english" style={{ textAlign: 'center', padding: '48px 0' }}>
        <h2 style={{ color: '#555555' }}>Chủ đề học không tồn tại</h2>
        <button 
          onClick={() => navigate('/learn-english')} 
          style={{ marginTop: '16px', padding: '8px 16px', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
        >
          Quay lại danh sách
        </button>
      </div>
    )
  }

  const tData = typeof topic.data === 'string' ? JSON.parse(topic.data) : (topic.data || {})
  const exercisesList = tData.exercises || []
  const totalSteps = 2 + exercisesList.length
  const progressPercentage = Math.round((currentStep / (totalSteps - 1)) * 100)

  return (
    <div className="learn-english learn-english--detail">
      {/* PHONE SIMULATION CONTAINER */}
      <div className="phone">
        
        {/* INTEGRATED TOP NAVIGATION BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-card-border)',
          background: 'var(--color-card-bg)',
        }}>
          <button 
            onClick={() => navigate('/learn-english')} 
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: 0,
              fontWeight: 400, // Làm chữ mỏng, không in đậm
              fontSize: '13px'
            }}
          >
            <ArrowLeftOutlined />
          </button>

          <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--color-text)' }}>
            {topic?.name}
          </span>

          {status !== 'NOT_STARTED' ? (
            <button
              onClick={handleResetProgress}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF3B5C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0,
                fontSize: '12px',
                fontWeight: 400 // Làm chữ mỏng, không in đậm
              }}
            >
              <ReloadOutlined />
            </button>
          ) : (
            <div style={{ width: '65px' }} />
          )}
        </div>
          
          {/* TRA TỪ DIỂN DRAWER */}
          <div className="drawer-bar" onClick={() => setDictOpen(!dictOpen)}>
            <span className="drawer-label">
              <GlobalOutlined className="drawer-icon" /> Tra từ nhanh
            </span>
            <span style={{ fontSize: '10px', color: '#555555' }}>
              {dictOpen ? '▲ Close' : '▼ Open'}
            </span>
          </div>

          <div className={`drawer-body ${dictOpen ? 'active' : ''}`}>
            <input 
              className="drawer-input" 
              placeholder="Nhập từ cần dịch..." 
              value={dictQuery}
              onChange={(e) => handleDictSearch(e.target.value)}
            />
            {dictResult ? (
              <div id="drawer-result" style={{ display: 'block' }}>
                <div className="drawer-word">{dictResult.word}</div>
                <div className="drawer-muted">{dictResult.meaning}</div>
                {dictResult.example && (
                  <div className="drawer-muted" style={{ fontStyle: 'italic', marginTop: '3px' }}>
                    {dictResult.example}
                  </div>
                )}
              </div>
            ) : dictQuery.trim() ? (
              <div id="drawer-result" style={{ display: 'block', padding: '6px 0' }}>
                <div className="drawer-muted" style={{ fontStyle: 'italic' }}>Không tìm thấy từ này trong từ vựng bài học.</div>
              </div>
            ) : null}
          </div>

          {/* TAB BAR (Strictly matches the 4-mode layout specs) */}
          <div className="tab-bar">
            <div 
              className={`tab ${activeTab === 'wizard' && currentStep === 0 ? 'active' : ''}`}
              onClick={() => { setActiveTab('wizard'); setCurrentStep(0); }}
            >
              Bài đọc
            </div>
            <div 
              className={`tab ${activeTab === 'wizard' && currentStep === 1 ? 'active' : ''}`}
              onClick={() => { setActiveTab('wizard'); setCurrentStep(1); }}
            >
              Từ vựng
            </div>
            <div 
              className={`tab ${activeTab === 'wizard' && currentStep >= 2 ? 'active' : ''}`}
              onClick={() => { setActiveTab('wizard'); if (currentStep < 2) setCurrentStep(2); }}
            >
              {currentStep >= 2 && exercisesList[currentStep - 2]?.type === 'matching' ? 'Matching' : 'Bài tập'}
            </div>
            <div 
              className={`tab ${activeTab === 'token' ? 'active' : ''}`}
              onClick={() => setActiveTab('token')}
            >
              Cấu hình
            </div>
          </div>

          {/* SCREEN ACTIVE CONTAINER */}
          
          {/* TAB WIZARD: MAIN PATHWAYS */}
          {activeTab === 'wizard' && (
            <>
              {/* SCREEN STEP 0: READING */}
              {currentStep === 0 && (
                <div className="screen active">
                  <div className="progress-row" style={{ marginBottom: '16px' }}>
                    <span className="progress-text">{currentStep + 1} / {totalSteps}</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                  
                  {tData.reading_passage ? (
                    <div className="reading-card">
                      <p className="reading-text" dangerouslySetInnerHTML={{
                        __html: tData.reading_passage.content.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')
                      }} />
                    </div>
                  ) : (
                    <p style={{ color: '#555555', fontStyle: 'italic' }}>Không có nội dung bài đọc.</p>
                  )}

                  <button className="next-btn" onClick={() => setCurrentStep(1)}>
                    Tiếp theo →
                  </button>
                </div>
              )}

              {/* SCREEN STEP 1: VOCABULARY */}
              {currentStep === 1 && (
                <div className="screen active">
                  <div className="progress-row" style={{ marginBottom: '16px' }}>
                    <span className="progress-text">{currentStep + 1} / {totalSteps}</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>

                  <div className="vocab-list">
                    {tData.vocabulary?.map((vocab: any, vIdx: number) => (
                      <div key={vIdx} className="vocab-card">
                        <div className="vocab-word">{vocab.word}</div>
                        <div className="vocab-viet">{vocab.vietnamese}</div>
                        {vocab.example && <div className="vocab-ex">"{vocab.example}"</div>}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button 
                      className="next-btn" 
                      style={{ 
                        flex: 1, 
                        background: 'var(--color-card-bg)', 
                        color: 'var(--color-primary)', 
                        border: '1px solid var(--color-primary)' 
                      }}
                      onClick={() => setCurrentStep(0)}
                    >
                      ←
                    </button>
                    <button className="next-btn" style={{ flex: 3 }} onClick={() => setCurrentStep(2)}>
                      Làm bài tập →
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN STEP >= 2: EXERCISES */}
              {currentStep >= 2 && (() => {
                const ex = exercisesList[currentStep - 2]
                if (!ex) return null

                return (
                  <div className="screen active" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '520px' }}>
                    <div className="progress-row">
                      <span className="progress-text">{currentStep + 1} / {totalSteps}</span>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                    </div>

                    <div className="ex-instruction">
                      {ex.instruction || 'Hoàn thành các câu hỏi sau'}
                    </div>

                    <div className="counter" style={{ marginBottom: '8px' }}>
                      Dạng bài {currentStep - 1} / {exercisesList.length}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '4px', marginBottom: '8px' }}>
                      {ex.questions.map((q: any, qIdx: number) => {
                        const gradeEx = gradingResult?.exercises?.find((item) => item.type === ex.type)
                        const qGraded = gradeEx?.questions?.find((item) => item.id === q.id)
                        const isCorrect = qGraded?.correct

                        return (
                          <div key={q.id || qIdx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: qIdx < ex.questions.length - 1 ? '1px dashed #222' : 'none', paddingBottom: qIdx < ex.questions.length - 1 ? '16px' : '0' }}>

                            {/* MATCHING EXERCISE */}
                            {ex.type === 'matching' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-text)', marginBottom: '4px', paddingLeft: '4px' }}>
                                  Câu {qIdx + 1}: {q.word}
                                </div>
                                <div className="options">
                                  {q.options?.map((opt: string, oIdx: number) => {
                                    const isSelected = getAnswerValue('matching', q.id) === opt
                                    const showCorrect = status === 'COMPLETED' && q.answer === opt
                                    const showWrong = status === 'COMPLETED' && isSelected && q.answer !== opt

                                    let optClass = 'option'
                                    if (isSelected) optClass += ' selected'
                                    if (showCorrect) optClass += ' correct'
                                    else if (showWrong) optClass += ' wrong'

                                    return (
                                      <button
                                        key={oIdx}
                                        className={optClass}
                                        disabled={status === 'COMPLETED'}
                                        onClick={() => handleAnswerChange('matching', q.id, opt)}
                                      >
                                        {opt}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* MULTIPLE CHOICE EXERCISE */}
                            {ex.type === 'multiple_choice' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="mcq-q">
                                  Câu {qIdx + 1}: {q.question}
                                </div>
                                <div className="mcq-opts">
                                  {Object.entries(q.options || {}).map(([key, val]: [string, any], oIdx: number) => {
                                    const isSelected = getAnswerValue('multiple_choice', q.id) === key
                                    const showCorrect = status === 'COMPLETED' && q.answer === key
                                    const showWrong = status === 'COMPLETED' && isSelected && q.answer !== key

                                    let optClass = 'mcq-opt'
                                    if (isSelected) optClass += ' selected'
                                    if (showCorrect) optClass += ' correct-opt'
                                    else if (showWrong) optClass += ' wrong-opt'

                                    return (
                                      <div
                                        key={oIdx}
                                        className={optClass}
                                        onClick={() => {
                                          if (status === 'COMPLETED') return
                                          handleAnswerChange('multiple_choice', q.id, key)
                                        }}
                                      >
                                        <div className="key">{key}</div>
                                        <div className="opt-text">{val}</div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* FILL WITH BANK EXERCISE */}
                            {ex.type === 'fill_with_bank' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                                  {ex.word_bank?.map((w: string, wIdx: number) => (
                                    <span
                                      key={wIdx}
                                      className="tag"
                                      onClick={() => {
                                        if (status === 'COMPLETED') return
                                        handleAnswerChange('fill_with_bank', q.id, w)
                                      }}
                                    >
                                      {w}
                                    </span>
                                  ))}
                                </div>
                                <div className="fill-sentence" style={{ paddingLeft: '4px' }}>
                                  {(() => {
                                    const parts = (q.sentence || '').split('___')
                                    const currentAns = getAnswerValue('fill_with_bank', q.id)
                                    return (
                                      <>
                                        Câu {qIdx + 1}: {parts[0]}
                                        <span className="blank">{currentAns || '___'}</span>
                                        {parts[1]}
                                      </>
                                    )
                                  })()}
                                </div>
                              </div>
                            )}

                            {/* TRANSLATE / DEFINITION EXERCISE */}
                            {['translate_to_english', 'definition_to_word'].includes(ex.type) && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px' }}>
                                  Câu {qIdx + 1}: {q.vietnamese || q.definition}
                                </div>
                                <input
                                  className="drawer-input"
                                  placeholder="Nhập câu trả lời của bạn..."
                                  value={getAnswerValue(ex.type, q.id)}
                                  disabled={status === 'COMPLETED'}
                                  onChange={(e) => handleAnswerChange(ex.type, q.id, e.target.value)}
                                />
                                {q.hint && (
                                  <div style={{ marginTop: '4px' }}>
                                    <button
                                      onClick={() => setShownHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                      style={{ background: 'none', border: '1px dashed #222', color: '#555', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                    >
                                      {shownHints[q.id] ? 'Ẩn gợi ý' : 'Gợi ý từ AI'}
                                    </button>
                                    {shownHints[q.id] && (
                                      <p style={{ color: '#888888', fontSize: '11px', marginTop: '6px', fontStyle: 'italic' }}>
                                        Hint: {q.hint}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* ERROR CORRECTION EXERCISE */}
                            {ex.type === 'error_correction' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="mcq-q" style={{ textDecoration: 'line-through', color: '#FF3B5C', borderColor: '#FF3B5C' }}>
                                  Câu {qIdx + 1}: {q.wrong_sentence}
                                </div>
                                <input
                                  className="drawer-input"
                                  placeholder="Sửa lại câu đúng..."
                                  value={getAnswerValue('error_correction', q.id)}
                                  disabled={status === 'COMPLETED'}
                                  onChange={(e) => handleAnswerChange('error_correction', q.id, e.target.value)}
                                />
                              </div>
                            )}

                            {/* OPEN ENDED EXERCISE */}
                            {ex.type === 'open_ended' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="mcq-q">
                                  Câu {qIdx + 1}: {q.question}
                                </div>
                                <textarea
                                  className="drawer-input"
                                  style={{ minHeight: '80px', resize: 'vertical', width: '100%' }}
                                  placeholder="Viết đoạn trả lời tự do..."
                                  value={getAnswerValue('open_ended', q.id)}
                                  disabled={status === 'COMPLETED'}
                                  onChange={(e) => handleAnswerChange('open_ended', q.id, e.target.value)}
                                />
                              </div>
                            )}

                            {/* GRADING RESULTS & AI FEEDBACK IN-PLACE */}
                            {status === 'COMPLETED' && qGraded && (
                              <div style={{ marginTop: '8px', borderTop: '1px dashed #222222', paddingTop: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span className={isCorrect ? 'highlight' : ''} style={{ fontSize: '12px', fontWeight: 600, color: isCorrect ? 'var(--color-primary)' : '#FF3B5C' }}>
                                    {isCorrect ? '✓ Đúng' : `✗ Sai - Đáp án: ${qGraded.correct_answer}`}
                                  </span>
                                </div>
                                <p style={{ color: '#888888', fontSize: '11px', marginTop: '4px', lineHeight: '16px', margin: '4px 0 0 0' }}>
                                  Feedback: {qGraded.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* NAVIGATION CONTROL BUTTON PANEL */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      {currentStep > 0 && (
                        <button 
                          className="next-btn" 
                          style={{ 
                            flex: 1, 
                            background: 'var(--color-card-bg)', 
                            color: 'var(--color-primary)', 
                            border: '1px solid var(--color-primary)' 
                          }}
                          onClick={() => setCurrentStep(prev => prev - 1)}
                        >
                          ←
                        </button>
                      )}

                      {currentStep < totalSteps - 1 ? (
                        <button 
                          className="next-btn"
                          style={{ flex: 3 }}
                          onClick={() => setCurrentStep(prev => prev + 1)}
                        >
                          Tiếp theo →
                        </button>
                      ) : (
                        <div style={{ flex: 3 }}>
                          {status !== 'COMPLETED' ? (
                            <button 
                              className="next-btn"
                              style={{ width: '100%' }}
                              disabled={isSubmitting}
                              onClick={handleSubmitGrading}
                            >
                              {isSubmitting ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <span>Chấm điểm</span>
                                  <span style={{ display: 'inline-block', width: '20px', textAlign: 'left', marginLeft: '2px' }}>{dots}</span>
                                </span>
                              ) : 'Nộp bài ngay'}
                            </button>
                          ) : (
                            <button 
                              className="next-btn"
                              style={{ width: '100%', background: 'var(--color-card-bg)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
                              onClick={() => {
                                message.info(`Tổng điểm bài làm của bạn đạt ${score}/100`)
                              }}
                            >
                              Điểm của bạn: {score}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {submitError && (
                      <p style={{ color: '#FF3B5C', fontSize: '11px', margin: '8px 0 0 0', textAlign: 'center' }}>
                        {submitError}
                      </p>
                    )}

                  </div>
                )
              })()}
            </>
          )}

          {/* TAB TOKEN: CONFIGURATION AND API KEY MANAGER (Heading and accent line removed) */}
          {activeTab === 'token' && (
            <div className="screen active">
              <div className="vocab-list" style={{ gap: '12px', marginTop: '16px' }}>
                <p className="drawer-muted" style={{ fontSize: '11px', color: '#555555', lineHeight: '16px', margin: 0 }}>
                  Lưu trữ khóa API Gemini cá nhân trong thiết bị của bạn để gửi yêu cầu chấm bài làm trực tiếp bằng mô hình AI.
                </p>

                <input 
                  type="password"
                  className="drawer-input"
                  placeholder="Nhập API Key (AIzaSy...)"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                />

                <button 
                  className="next-btn"
                  style={{ marginTop: '4px' }}
                  onClick={() => {
                    if (!newToken.trim()) return
                    const val = newToken.trim()
                    const newT = { id: Date.now().toString(), value: val }
                    const updated = [...tokens, newT]
                    setTokens(updated)
                    localStorage.setItem('learn_tokens', JSON.stringify(updated))
                    setNewToken('')
                    message.success('Đã lưu khóa API thành công!')
                  }}
                >
                  Lưu Key mới
                </button>

                {tokens.length > 0 && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid #1a1a1a', paddingTop: '12px' }}>
                    <div className="ex-instruction" style={{ marginBottom: '8px' }}>Khóa đang lưu</div>
                    {tokens.map((tok) => (
                      <div key={tok.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        background: 'var(--color-card-bg)', 
                        padding: '10px 14px', 
                        borderRadius: 'var(--radius-md)', // Đồng bộ bo góc 12px giống câu hỏi/input khác
                        border: '1px solid var(--color-card-border)', 
                        width: '100%',
                        boxSizing: 'border-box',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                          ••••••••{tok.value.slice(-8)}
                        </span>
                        <button 
                          onClick={() => {
                            const updated = tokens.filter((t) => t.id !== tok.id)
                            setTokens(updated)
                            localStorage.setItem('learn_tokens', JSON.stringify(updated))
                            message.success('Đã gỡ API Key thành công!')
                          }}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#FF3B5C', 
                            cursor: 'pointer', 
                            fontSize: '12px',
                            padding: 0,
                            fontWeight: 500
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
  )
}
