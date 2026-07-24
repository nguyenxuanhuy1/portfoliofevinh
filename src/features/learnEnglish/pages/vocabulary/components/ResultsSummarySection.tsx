import type { GradingResult, Exercise } from '../../../types/LearnEnglish'
import Button from '../../../components/ui/Button'
import { LE_COLORS, LE_RESULT_ROW_COLORS } from '../../../styles/colors'

interface ResultsSummarySectionProps {
  gradingResult: GradingResult;
  exercisesList: Exercise[];
  onReview: (step?: number) => void;
}

export default function ResultsSummarySection({
  gradingResult,
  onReview
}: ResultsSummarySectionProps) {
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

  const padZero = (num: number) => (num < 10 ? `0${num}` : num.toString())

  const totalQuestions = gradingResult.exercises?.reduce((acc, ex) => acc + (ex.questions?.length || 0), 0) || 0
  const correctQuestions = gradingResult.exercises?.reduce((acc, ex) => acc + (ex.questions?.filter(q => q.correct).length || 0), 0) || 0
  const pass = gradingResult.total_score >= 70

  return (
    <div className="screen active results-summary-screen" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="results-score-card">
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', color: LE_COLORS.ink }}>
          {pass ? 'Hoàn thành!' : 'Cần cố gắng thêm'}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
          <span className="results-score-value">{gradingResult.total_score}</span>
          <span className="results-score-max">/ 100</span>
        </div>
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: LE_COLORS.ink }}>
            Đúng {correctQuestions}/{totalQuestions} câu
          </span>
          <div className="progress-bar" style={{ width: '100px', flex: 'none' }}>
            <div
              className="progress-fill"
              style={{
                width: `${(correctQuestions / (totalQuestions || 1)) * 100}%`,
                background: pass ? LE_COLORS.green : LE_COLORS.coral
              }}
            />
          </div>
        </div>
      </div>

      {gradingResult.overall_feedback && (
        <div style={{
          border: `3px solid ${LE_COLORS.ink}`,
          boxShadow: `4px 4px 0 ${LE_COLORS.ink}`,
          background: LE_COLORS.white,
          padding: '14px 16px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', color: LE_COLORS.ink }}>
            Đánh giá AI
          </div>
          <p style={{ fontSize: '13px', color: LE_COLORS.gray850, lineHeight: '20px', margin: 0, fontWeight: 500 }}>
            {gradingResult.overall_feedback}
          </p>
        </div>
      )}

      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', color: LE_COLORS.ink }}>
          Chi tiết từng dạng bài
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {gradingResult.exercises?.map((ex, idx) => {
            const exCorrect = ex.questions?.filter(q => q.correct).length || 0
            const exTotal = ex.questions?.length || 0

            return (
              <div
                key={idx}
                className="results-ex-row"
                onClick={() => onReview(idx + 2)}
                style={{ background: LE_RESULT_ROW_COLORS[idx % LE_RESULT_ROW_COLORS.length] }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: LE_COLORS.fontDisplay,
                    fontSize: '14px',
                    background: LE_COLORS.ink,
                    color: LE_COLORS.white,
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {padZero(idx + 1)}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                    <span style={{ fontFamily: LE_COLORS.fontDisplay, fontSize: '14px', textTransform: 'uppercase', color: LE_COLORS.ink, lineHeight: 1.2 }}>
                      {getExerciseTitle(ex.type)}
                    </span>
                    {ex.feedback && (
                      <span style={{ fontSize: '11px', color: LE_COLORS.gray850, lineHeight: '15px', fontWeight: 500 }}>
                        {ex.feedback}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{
                  fontFamily: LE_COLORS.fontDisplay,
                  fontSize: '16px',
                  color: LE_COLORS.ink,
                  background: LE_COLORS.white,
                  border: `2px solid ${LE_COLORS.ink}`,
                  padding: '4px 10px',
                  flexShrink: 0,
                }}>
                  {exCorrect}/{exTotal}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
        <Button onClick={() => onReview()} className="next-btn" style={{ width: '100%', margin: 0 }}>
          Xem lại tất cả đáp án →
        </Button>
      </div>
    </div>
  )
}
