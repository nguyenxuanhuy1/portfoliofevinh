import type { GradingResult, Exercise } from '../../../types/LearnEnglish'
import Button from '../../../components/ui/Button'

interface ResultsSummarySectionProps {
  gradingResult: GradingResult;
  exercisesList: Exercise[];
  onReview: (step?: number) => void;
}

export default function ResultsSummarySection({
  gradingResult,
  onReview
}: ResultsSummarySectionProps) {
  // Editorial color values placeholders - customize color values manually below:
  const colors = {
    text: 'var(--color-text)',               // Body text
    textMuted: 'var(--color-text-muted)',    // Secondary / muted
    scoreColor: 'var(--color-primary)',      // Main score accent
    primary: 'var(--color-primary)',         // Button primary line
    border: 'var(--color-card-border)',      // Editorial thin dividers
    progressBg: 'var(--color-card-border)',  // Progress bar tracks
    progressFill: 'var(--color-primary)'     // Progress bar indicator fill
  }

  const getExerciseTitle = (type: string) => {
    switch (type) {
      case 'matching': return 'Nối từ vựng'
      case 'multiple_choice': return 'Trắc nghiệm chọn đáp án'
      case 'fill_with_bank': return 'Điền từ vào chỗ trống'
      case 'translate_to_english': return 'Dịch sang tiếng Anh'
      case 'definition_to_word': return 'Đoán từ qua định nghĩa'
      case 'error_correction': return 'Sửa lỗi sai trong câu'
      case 'open_ended': return 'Đọc hiểu & Trả lời tự do'
      default: return type
    }
  }

  const padZero = (num: number) => {
    return num < 10 ? `0${num}` : num.toString()
  }

  const totalQuestions = gradingResult.exercises?.reduce((acc, ex) => acc + (ex.questions?.length || 0), 0) || 0
  const correctQuestions = gradingResult.exercises?.reduce((acc, ex) => acc + (ex.questions?.filter(q => q.correct).length || 0), 0) || 0

  return (
    <div className="screen active results-summary-screen" style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'sans-serif' }}>

      {/* SCORE AREA */}
      <div style={{ padding: 0, textAlign: 'center' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
          <span style={{ fontSize: '50px', fontWeight: 700, fontFamily: 'SFMono-Regular, Consolas, Menlo, monospace', color: colors.scoreColor, letterSpacing: '-2px', lineHeight: '1' }}>
            {gradingResult.total_score}
          </span>
          <span style={{ fontSize: '20px', fontFamily: 'SFMono-Regular, Consolas, Menlo, monospace', color: colors.textMuted, fontWeight: 400 }}>
            / 100
          </span>
        </div>

        {/* COMPACT STATUS BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
          <div style={{ fontSize: '12px', color: colors.textMuted }}>
            Đúng {correctQuestions}/{totalQuestions} câu hỏi
          </div>
          <div style={{ height: '3px', width: '80px', background: colors.progressBg, borderRadius: '1.5px', overflow: 'hidden' }}>
            <div style={{ width: `${(correctQuestions / (totalQuestions || 1)) * 100}%`, height: '100%', background: colors.progressFill }} />
          </div>
        </div>
      </div>

      {/* AI FEEDBACK */}
      {gradingResult.overall_feedback && (
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 500, color: colors.textMuted, textTransform: 'none', margin: '0 0 8px 0' }}>
            Đánh giá
          </h2>
          <p style={{ fontSize: '13px', color: colors.textMuted, lineHeight: '20px', fontStyle: 'italic', margin: 0 }}>
            "{gradingResult.overall_feedback}"
          </p>
        </div>
      )}

      {/* DETAILS BREAKDOWN */}
      <div style={{ textAlign: 'left' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 500, color: colors.textMuted, textTransform: 'none', margin: '0 0 8px 0' }}>
          Chi tiết từng dạng bài
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {gradingResult.exercises?.map((ex, idx) => {
            const exCorrect = ex.questions?.filter(q => q.correct).length || 0
            const exTotal = ex.questions?.length || 0

            return (
              <div
                key={idx}
                onClick={() => onReview(idx + 2)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  gap: '16px'
                }}
                className="exercise-row-item"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                  <span style={{ fontSize: '13px', fontFamily: 'SFMono-Regular, Consolas, Menlo, monospace', color: colors.textMuted, marginTop: '2px' }}>
                    {padZero(idx + 1)}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textMuted }}>
                      {getExerciseTitle(ex.type)}
                    </span>
                    {ex.feedback && (
                      <span style={{ fontSize: '11px', color: colors.textMuted, lineHeight: '15px' }}>
                        {ex.feedback}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', minWidth: '60px', marginTop: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: 'SFMono-Regular, Consolas, Menlo, monospace', color: colors.text }}>
                    {exCorrect}/{exTotal}
                  </span>
                  {/* SMALL INLINE PROGRESS BAR (3px height) */}
                  <div style={{ width: '100%', height: '3px', background: colors.progressBg, borderRadius: '1.5px', overflow: 'hidden' }}>
                    <div style={{ width: `${(exCorrect / (exTotal || 1)) * 100}%`, height: '100%', background: colors.progressFill }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* BACK TO REVIEW ALL */}
      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <Button
          onClick={() => onReview()}
          className="next-btn"
          style={{
            width: '100%',
            margin: 0,
            background: 'transparent',
            color: colors.primary,
            borderColor: colors.primary,
            borderWidth: '1.5px',
            fontWeight: 500
          }}
        >
          Xem lại tất cả đáp án
        </Button>
      </div>

    </div>
  )
}
