interface VocabularySectionProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  vocabulary?: Array<{
    word: string;
    vietnamese: string;
    example?: string;
  }> | null;
}

export default function VocabularySection({
  currentStep,
  totalSteps,
  progressPercentage,
  vocabulary
}: VocabularySectionProps) {
  return (
    <div className="screen active">
      <div className="progress-row" style={{ marginBottom: '16px' }}>
        <span className="progress-text">{currentStep + 1} / {totalSteps}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="vocab-list">
        {vocabulary?.map((vocab: any, vIdx: number) => (
          <div key={vIdx} className="vocab-card">
            <div className="vocab-word">{vocab.word}</div>
            <div className="vocab-viet">{vocab.vietnamese}</div>
            {vocab.example && <div className="vocab-ex">"{vocab.example}"</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
