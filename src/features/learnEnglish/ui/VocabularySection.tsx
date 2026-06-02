import { useState } from 'react'
import { SoundOutlined } from '@ant-design/icons'
import Button from './Button'

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
  const [speakingWord, setSpeakingWord] = useState<string | null>(null)

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'

      const voices = window.speechSynthesis.getVoices()
      const enVoice = voices.find(v => v.lang.startsWith('en') || v.lang.includes('en-'))
      if (enVoice) {
        utterance.voice = enVoice
      }

      utterance.onstart = () => setSpeakingWord(text)
      utterance.onend = () => setSpeakingWord(null)
      utterance.onerror = () => setSpeakingWord(null)

      window.speechSynthesis.speak(utterance)
    } else {
      console.warn('Web Speech API is not supported in this browser.')
    }
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
        {vocabulary?.map((vocab: any, vIdx: number) => (
          <div key={vIdx} className="vocab-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div>
                <div className="vocab-word">{vocab.word}</div>
                <div className="vocab-viet">{vocab.vietnamese}</div>
              </div>
              <Button
                onClick={() => speak(vocab.word)}
                className={`vocab-speak-btn ${speakingWord === vocab.word ? 'speaking' : ''}`}
                title="Phát âm"
              >
                <SoundOutlined />
              </Button>
            </div>
            {vocab.example && <div className="vocab-ex">"{vocab.example}"</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
