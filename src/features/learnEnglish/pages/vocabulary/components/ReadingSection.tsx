import { useEffect, useState } from 'react'
import { SoundOutlined } from '@ant-design/icons'
import { LE_COLORS } from '../../../styles/colors'
import { speakEnglish, stopSpeaking, stripMarkdownForSpeech } from '../../../utils/speechUtils'

interface ReadingSectionProps {
  currentStep: number
  totalSteps: number
  progressPercentage: number
  readingPassage?: {
    content: string
  } | null
}

export default function ReadingSection({
  currentStep,
  totalSteps,
  progressPercentage,
  readingPassage
}: ReadingSectionProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    return () => {
      stopSpeaking()
    }
  }, [])

  const handleToggleSpeak = () => {
    if (!readingPassage?.content) return

    if (isSpeaking) {
      stopSpeaking()
      setIsSpeaking(false)
      return
    }

    const plainText = stripMarkdownForSpeech(readingPassage.content)
    speakEnglish(plainText, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    })
  }

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
            <div className="reading-card__toolbar">
              <span className="reading-card__label">Bài đọc</span>
              <button
                type="button"
                onClick={handleToggleSpeak}
                className={`vocab-speak-btn reading-speak-btn ${isSpeaking ? 'speaking' : ''}`}
                title={isSpeaking ? 'Dừng đọc' : 'Nghe bài đọc'}
                aria-label={isSpeaking ? 'Dừng đọc' : 'Nghe bài đọc'}
              >
                <SoundOutlined />
              </button>
            </div>
            <p
              className="reading-text"
              dangerouslySetInnerHTML={{
                __html: readingPassage.content.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')
              }}
            />
          </div>
        ) : (
          <p style={{ color: LE_COLORS.gray700, fontStyle: 'italic' }}>Không có nội dung bài đọc.</p>
        )}
      </div>
    </div>
  )
}
