import React from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import type { Exercise, ExerciseType, GradingResult } from '../../../types/LearnEnglish'

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

      <div className="vocab-list">
        {ex.questions.map((q: any, qIdx: number) => {
          const gradeEx = gradingResult?.exercises?.find((item) => item.type === ex.type)
          const qGraded = gradeEx?.questions?.find((item) => item.id?.toString() === q.id?.toString())
          const isCorrect = qGraded?.correct

          return (
            <div key={q.id || qIdx} className="vocab-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* MATCHING EXERCISE */}
              {ex.type === 'matching' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px' }}>
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
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px' }}>
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
                  <div className="fill-sentence" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', paddingLeft: '4px', lineHeight: '18px', marginBottom: '8px' }}>
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
                        onClick={() => setShownHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                        style={{ background: 'none', border: '1px dashed #222', color: '#555', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        {shownHints[q.id] ? 'Ẩn gợi ý' : 'Gợi ý từ AI'}
                      </Button>
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
                  <div style={{ fontSize: '13px', color: '#FF3B5C', textDecoration: 'line-through', marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px' }}>
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
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', paddingLeft: '4px', lineHeight: '18px' }}>
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
                <div style={{ marginTop: '8px', borderTop: '1px dashed #222222', paddingTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={isCorrect ? 'highlight' : ''} style={{ fontSize: '12px', fontWeight: 600, color: isCorrect ? '#52C41A' : '#FF3B5C' }}>
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

      {submitError && (
        <p style={{ color: '#FF3B5C', fontSize: '11px', margin: '8px 0 0 0', textAlign: 'center' }}>
          {submitError}
        </p>
      )}
    </div>
  )
}
