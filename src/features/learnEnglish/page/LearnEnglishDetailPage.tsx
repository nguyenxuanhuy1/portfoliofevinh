import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftOutlined,
  GlobalOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import Modal from '../../../components/ui/Modal'
import message from '../../../components/ui/Message'
import Input from '../../../components/ui/Input'
import Button from '../ui/Button'

import { useLearnTopicByIdQuery } from '../../../hooks/useLearnTopicQuery'
import learnTopicService from '../../admin/topic/service/learnTopicService'
import Skeleton from '../../../components/ui/Skeleton'
import type { ExerciseType, GradingResult, Exercise } from '../../../types/LearnEnglish'
import GeminiTokenConfig from '../ui/GeminiTokenConfig'
import ReadingSection from '../ui/ReadingSection'
import VocabularySection from '../ui/VocabularySection'
import ExercisesSection from '../ui/ExercisesSection'
import ResultsSummarySection from '../ui/ResultsSummarySection'
import GradingLoadingScreen from '../ui/GradingLoadingScreen'
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
  const [showResultsScreen, setShowResultsScreen] = useState(false)

  const [pendingResult, setPendingResult] = useState<{
    result: GradingResult
    finalAnswers: any
  } | null>(null)
  const [animationDone, setAnimationDone] = useState(false)

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

  // Listen to grading:done custom event
  useEffect(() => {
    const handleGradingDone = () => {
      setAnimationDone(true)
    }

    document.addEventListener('grading:done', handleGradingDone)
    return () => {
      document.removeEventListener('grading:done', handleGradingDone)
    }
  }, [])

  // Process completed grading once both API and animation are complete
  useEffect(() => {
    if (pendingResult && animationDone) {
      const { result, finalAnswers } = pendingResult

      setGradingResult(result)
      setScore(result.total_score)
      setStatus('COMPLETED')
      setShowResultsScreen(true)

      localStorage.setItem(`learn_progress_${id}`, JSON.stringify({
        topicId: id,
        status: 'COMPLETED',
        answers: finalAnswers,
        score: result.total_score,
        gradingResult: result
      }))

      saveToHistory(result.total_score)
      message.success('Bài làm đã được chấm điểm tự động thành công!')

      setIsSubmitting(false)
      setPendingResult(null)
      setAnimationDone(false)
    }
  }, [pendingResult, animationDone, id])

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
          setShowResultsScreen(true)
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
      } catch { }
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
    setPendingResult(null)
    setAnimationDone(false)

    try {
      const dataObj = typeof topic.data === 'string' ? JSON.parse(topic.data) : topic.data
      const finalAnswers = (dataObj.exercises || []).map((ex: Exercise) => {
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
      setPendingResult({ result, finalAnswers })
    } catch (err: any) {
      console.error('Lỗi chấm điểm:', err)
      setSubmitError(err.message || 'Lỗi kết nối máy chủ AI.')
      message.error('Chấm điểm thất bại, vui lòng kiểm tra API Key.')
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
        setShowResultsScreen(false)
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
        <Button
          onClick={() => navigate('/learn-english')}
          style={{ marginTop: '16px', padding: '8px 16px', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
        >
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const tData = typeof topic.data === 'string' ? JSON.parse(topic.data) : (topic.data || {})
  const exercisesList = tData.exercises || []
  const totalSteps = 2 + exercisesList.length
  const progressPercentage = Math.round((currentStep / (totalSteps - 1)) * 100)
  const totalQuestions = exercisesList.reduce((acc: number, ex: any) => acc + (ex.questions?.length || 0), 0) || 0

  return (
    <>
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
          <Button
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
          </Button>

          <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--color-text)' }}>
            {topic?.name}
          </span>

          {status !== 'NOT_STARTED' ? (
            <Button
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
                fontWeight: 400
              }}
            >
              <ReloadOutlined />
            </Button>
          ) : (
            <Button
              style={{
                background: 'none',
                border: 'none',
                color: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0,
                fontSize: '12px',
                fontWeight: 400
              }}
            >
              <ReloadOutlined />
            </Button>
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
          <Input
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
            className={`tab ${activeTab === 'wizard' && currentStep === 0 && (!showResultsScreen || status !== 'COMPLETED') ? 'active' : ''}`}
            onClick={() => { setActiveTab('wizard'); setCurrentStep(0); setShowResultsScreen(false); }}
          >
            Bài đọc
          </div>
          <div
            className={`tab ${activeTab === 'wizard' && currentStep === 1 && (!showResultsScreen || status !== 'COMPLETED') ? 'active' : ''}`}
            onClick={() => { setActiveTab('wizard'); setCurrentStep(1); setShowResultsScreen(false); }}
          >
            Từ vựng
          </div>
          <div
            className={`tab ${activeTab === 'wizard' && currentStep >= 2 && (!showResultsScreen || status !== 'COMPLETED') ? 'active' : ''}`}
            onClick={() => { setActiveTab('wizard'); if (currentStep < 2) setCurrentStep(2); setShowResultsScreen(false); }}
          >
            {currentStep >= 2 && exercisesList[currentStep - 2]?.type === 'matching' ? 'Bài tập' : 'Bài tập'}
          </div>
          <div
            className={`tab ${activeTab === 'token' ? 'active' : ''}`}
            onClick={() => { setActiveTab('token'); setShowResultsScreen(false); }}
          >
            Cấu hình
          </div>
        </div>

        {/* SCREEN ACTIVE CONTAINER */}

        {/* TAB WIZARD: MAIN PATHWAYS */}
        {activeTab === 'wizard' && (
          <>
            {status === 'COMPLETED' && showResultsScreen && gradingResult ? (
              <ResultsSummarySection
                gradingResult={gradingResult}
                exercisesList={exercisesList}
                onReview={(stepStep) => {
                  setShowResultsScreen(false)
                  setCurrentStep(stepStep !== undefined ? stepStep : 2)
                }}
              />
            ) : (
              <>
                {/* SCREEN STEP 0: READING */}
                {currentStep === 0 && (
                  <ReadingSection
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    progressPercentage={progressPercentage}
                    readingPassage={tData.reading_passage}
                  />
                )}

                {/* SCREEN STEP 1: VOCABULARY */}
                {currentStep === 1 && (
                  <VocabularySection
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    progressPercentage={progressPercentage}
                    vocabulary={tData.vocabulary}
                  />
                )}

                {/* SCREEN STEP >= 2: EXERCISES */}
                {currentStep >= 2 && (
                  <ExercisesSection
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    progressPercentage={progressPercentage}
                    exercisesList={exercisesList}
                    status={status}
                    gradingResult={gradingResult}
                    getAnswerValue={getAnswerValue}
                    handleAnswerChange={handleAnswerChange}
                    shownHints={shownHints}
                    setShownHints={setShownHints}
                    submitError={submitError}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* TAB TOKEN: CONFIGURATION AND API KEY MANAGER */}
        {activeTab === 'token' && (
          <GeminiTokenConfig
            newToken={newToken}
            setNewToken={setNewToken}
            tokens={tokens}
            setTokens={setTokens}
          />
        )}

        {/* ELEGANT FIXED BOTTOM NAVIGATION BAR */}
        {activeTab === 'wizard' && !showResultsScreen && (
          <div className="bottom-nav-bar">
            {currentStep === 0 && (
              <div style={{ display: 'flex', width: '100%' }}>
                <Button className="next-btn" style={{ width: '100%', margin: 0 }} onClick={() => setCurrentStep(1)}>
                  Tiếp theo →
                </Button>
              </div>
            )}

            {currentStep === 1 && (
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <Button
                  className="next-btn"
                  style={{
                    flex: 1,
                    margin: 0,
                    background: 'var(--color-card-bg)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)'
                  }}
                  onClick={() => setCurrentStep(0)}
                >
                  ←
                </Button>
                <Button className="next-btn" style={{ flex: 3, margin: 0 }} onClick={() => setCurrentStep(2)}>
                  Làm bài tập →
                </Button>
              </div>
            )}

            {currentStep >= 2 && (
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                {currentStep > 0 && (
                  <Button
                    className="next-btn"
                    style={{
                      flex: 1,
                      margin: 0,
                      background: 'var(--color-card-bg)',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-primary)'
                    }}
                    onClick={() => setCurrentStep(prev => prev - 1)}
                  >
                    ←
                  </Button>
                )}

                {currentStep < totalSteps - 1 ? (
                  <Button
                    className="next-btn"
                    style={{ flex: 3, margin: 0 }}
                    onClick={() => setCurrentStep(prev => prev + 1)}
                  >
                    Tiếp theo →
                  </Button>
                ) : (
                  <div style={{ flex: 3 }}>
                    {status !== 'COMPLETED' ? (
                      <Button
                        className="next-btn"
                        style={{ width: '100%', margin: 0 }}
                        disabled={isSubmitting}
                        onClick={handleSubmitGrading}
                      >
                        {isSubmitting ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>Chấm điểm</span>
                            <span style={{ display: 'inline-block', width: '20px', textAlign: 'left', marginLeft: '2px' }}>{dots}</span>
                          </span>
                        ) : 'Nộp bài ngay'}
                      </Button>
                    ) : (
                      <Button
                        className="next-btn"
                        style={{ width: '100%', margin: 0, background: 'var(--color-card-bg)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
                        onClick={() => {
                          setShowResultsScreen(true)
                        }}
                      >
                        Xem tổng kết điểm: {score}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>

    {isSubmitting && (
      <div className="fullscreen-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(8px)', pointerEvents: 'all' }}>
        <GradingLoadingScreen totalQuestions={totalQuestions} />
      </div>
    )}
  </>
)
}
