import React from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import type { Exercise, ExerciseType, GradingResult } from '../../../types/LearnEnglish'
import { LE_COLORS } from '../../../styles/colors'

interface ExercisesSectionProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  exercisesList: Exercise[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  gradingResult: GradingResult | null;
  getAnswerValue: (type: ExerciseType, questionId: number) => string;
  handleAnswerChange: (type: ExerciseType, questionId: number, value: string) => void;
  shownHints: Record<string, boolean>;
  setShownHints: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  submitError: string | null;
}

export default function ExercisesSection({
  currentStep,
  totalSteps,
  progressPercentage,
  exercisesList,
  status,
  gradingResult,
  getAnswerValue,
  handleAnswerChange,
  shownHints,
  setShownHints,
  submitError
}: ExercisesSectionProps) {
  const ex = exercisesList[currentStep - 2]
  if (!ex) return null

  const [activeQuestionId, setActiveQuestionId] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (ex && ex.type === 'fill_with_bank' && ex.questions.length > 0) {
      setActiveQuestionId(ex.questions[0].id)
    } else {
      setActiveQuestionId(null)
    }
  }, [ex])

  const filledAnswers = ex && ex.type === 'fill_with_bank' ? ex.questions.map((q: any) => getAnswerValue('fill_with_bank', q.id)) : []
  const unusedWords = ex && ex.word_bank ? ex.word_bank.filter((w: string) => !filledAnswers.includes(w)) : []


  return (
    <div className="screen active">
      <div className="progress-row" style={{ marginBottom: '16px' }}>
        <span className="progress-text">{currentStep + 1} / {totalSteps}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="ex-instruction" style={{ marginBottom: '12px' }}>
        {ex.instruction || 'Hoàn thành các câu hỏi sau'}
      </div>

      <div className="counter" style={{ marginBottom: '12px' }}>
        Dạng bài {currentStep - 1} / {exercisesList.length}
      </div>

      {/* WORD BANK DISPLAYED ONCE AT THE TOP */}
      {ex.type === 'fill_with_bank' && (
        <div className="sticky-word-bank">
          <div className="word-bank-panel">
            {unusedWords.length === 0 ? (
              <span style={{ fontSize: '12px', color: LE_COLORS.white, fontWeight: 700, width: '100%', textAlign: 'center', textTransform: 'uppercase' }}>
                Đã điền hết tất cả các từ gợi ý!
              </span>
            ) : (
              unusedWords.map((w: string, wIdx: number) => (
                <span
                  key={wIdx}
                  className="tag"
                  onClick={() => {
                    if (status === 'COMPLETED') return
                    if (activeQuestionId !== null) {
                      handleAnswerChange('fill_with_bank', activeQuestionId, w)
                    }
                  }}
                >
                  {w}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      <div className="vocab-list">
        {ex.questions.map((q: any, qIdx: number) => {
          const gradeEx = gradingResult?.exercises?.find((item) => item.type === ex.type)
          const qGraded = gradeEx?.questions?.find((item) => item.id?.toString() === q.id?.toString())
          const isCorrect = qGraded?.correct

          return (
            <div
              key={q.id || qIdx}
              className={`vocab-card ${ex.type === 'fill_with_bank' && activeQuestionId === q.id ? 'active-fill-card' : ''}`}
              onClick={() => {
                if (status === 'COMPLETED') return
                if (ex.type === 'fill_with_bank') {
                  setActiveQuestionId(q.id)
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                cursor: ex.type === 'fill_with_bank' && status !== 'COMPLETED' ? 'pointer' : 'default',
                transition: 'transform 100ms, box-shadow 100ms',
                ...(ex.type === 'fill_with_bank' && activeQuestionId === q.id && status !== 'COMPLETED' ? {
                  borderColor: LE_COLORS.ink,
                  background: LE_COLORS.yellow
                } : {})
              }}
            >

              {/* MATCHING EXERCISE */}
              {ex.type === 'matching' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: LE_COLORS.ink, marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px', fontWeight: 700 }}>
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
                        <Button
                          key={oIdx}
                          className={optClass}
                          onClick={() => handleAnswerChange('matching', q.id, opt)}
                        >
                          {opt}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* MULTIPLE CHOICE EXERCISE */}
              {ex.type === 'multiple_choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: LE_COLORS.ink, marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px', fontWeight: 700 }}>
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
                  <div className="fill-sentence" style={{ fontSize: '14px', color: LE_COLORS.ink, paddingLeft: '4px', lineHeight: '28px', marginBottom: '0px', fontWeight: 600 }}>
                    {(() => {
                      const parts = (q.sentence || '').split('___')
                      const currentAns = getAnswerValue('fill_with_bank', q.id)
                      
                      const isActive = activeQuestionId === q.id
                      const showGrade = status === 'COMPLETED'
                      
                      const blankBorderColor = showGrade
                        ? (isCorrect ? LE_COLORS.green : LE_COLORS.wrong)
                        : (isActive ? LE_COLORS.ink : LE_COLORS.ink)
                      
                      const blankTextColor = showGrade
                        ? (isCorrect ? LE_COLORS.ink : LE_COLORS.wrong)
                        : (currentAns ? LE_COLORS.ink : LE_COLORS.gray700)

                      const blankBorderStyle = showGrade || currentAns || isActive ? 'solid' : 'dashed'

                      return (
                        <>
                          Câu {qIdx + 1}: {parts[0]}
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              if (status === 'COMPLETED') return
                              setActiveQuestionId(q.id)
                              if (currentAns) {
                                handleAnswerChange('fill_with_bank', q.id, '')
                              }
                            }}
                            style={{
                              display: 'inline-block',
                              minWidth: '85px',
                              textAlign: 'center',
                              borderBottom: `2.5px ${blankBorderStyle} ${blankBorderColor}`,
                              color: blankTextColor,
                              padding: '2px 4px 0px',
                              margin: '0 6px',
                              fontWeight: currentAns ? 500 : 600,
                              fontSize: '14px',
                              verticalAlign: 'bottom',
                              cursor: status === 'COMPLETED' ? 'default' : 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {currentAns || '...'}
                          </span>
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
                  <div style={{ fontSize: '13px', color: LE_COLORS.ink, marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px', fontWeight: 700 }}>
                    Câu {qIdx + 1}: {q.vietnamese || q.definition}
                  </div>
                  <Input
                    className="drawer-input"
                    placeholder="Nhập câu trả lời của bạn..."
                    value={getAnswerValue(ex.type as ExerciseType, q.id)}
                    disabled={status === 'COMPLETED'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(ex.type as ExerciseType, q.id, e.target.value)}
                  />
                  {q.hint && (
                    <div style={{ marginTop: '4px' }}>
                      <Button
                        className="ai-hint-btn"
                        onClick={() => setShownHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      >
                        {shownHints[q.id] ? 'Ẩn gợi ý' : 'Gợi ý từ AI'}
                      </Button>
                      {shownHints[q.id] && (
                        <p style={{ color: LE_COLORS.gray550, fontSize: '11px', marginTop: '6px', fontStyle: 'italic' }}>
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
                  <div style={{ fontSize: '13px', color: LE_COLORS.wrong, textDecoration: 'line-through', marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px' }}>
                    Câu {qIdx + 1}: {q.wrong_sentence}
                  </div>
                  <Input
                    className="drawer-input"
                    placeholder="Sửa lại câu đúng..."
                    value={getAnswerValue('error_correction', q.id)}
                    disabled={status === 'COMPLETED'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange('error_correction', q.id, e.target.value)}
                  />
                </div>
              )}

              {/* OPEN ENDED EXERCISE */}
              {ex.type === 'open_ended' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: LE_COLORS.ink, marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px', fontWeight: 700 }}>
                    Câu {qIdx + 1}: {q.question}
                  </div>
                  <Input.TextArea
                    className="drawer-input"
                    style={{ minHeight: '80px', resize: 'vertical', width: '100%' }}
                    placeholder="Viết đoạn trả lời tự do..."
                    value={getAnswerValue('open_ended', q.id)}
                    disabled={status === 'COMPLETED'}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange('open_ended', q.id, e.target.value)}
                  />
                </div>
              )}

              {/* GRADING RESULTS & AI FEEDBACK IN-PLACE */}
              {status === 'COMPLETED' && qGraded && (
                <div style={{ marginTop: '8px', borderTop: `1px dashed ${LE_COLORS.gray900}`, paddingTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={isCorrect ? 'highlight' : ''} style={{ fontSize: '12px', fontWeight: 600, color: isCorrect ? LE_COLORS.green : LE_COLORS.wrong }}>
                      {isCorrect ? '✓ Đúng' : `✗ Sai - Đáp án: ${qGraded.correct_answer}`}
                    </span>
                  </div>
                  <p style={{ color: LE_COLORS.gray550, fontSize: '11px', marginTop: '4px', lineHeight: '16px', margin: '4px 0 0 0' }}>
                    Feedback: {qGraded.feedback}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {submitError && (
        <p style={{ color: LE_COLORS.wrong, fontSize: '11px', margin: '8px 0 0 0', textAlign: 'center' }}>
          {submitError}
        </p>
      )}
    </div>
  )
}
