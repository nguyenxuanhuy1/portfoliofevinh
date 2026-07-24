import { LE_COLORS } from '../../../styles/colors'
interface ReadingSectionProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  readingPassage?: {
    content: string;
  } | null;
}

export default function ReadingSection({
  currentStep,
  totalSteps,
  progressPercentage,
  readingPassage
}: ReadingSectionProps) {
  return (
    <div className="screen active">
      <div className="progress-row" style={{ marginBottom: '16px' }}>
        <span className="progress-text">{currentStep + 1} / {totalSteps}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="vocab-list">
        {readingPassage ? (
          <div className="reading-card" style={{ margin: 0 }}>
            <p className="reading-text" dangerouslySetInnerHTML={{
              __html: readingPassage.content.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')
            }} />
          </div>
        ) : (
          <p style={{ color: LE_COLORS.gray700, fontStyle: 'italic' }}>Không có nội dung bài đọc.</p>
        )}
      </div>
    </div>
  )
}
