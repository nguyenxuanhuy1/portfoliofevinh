/** Web Speech API helpers for learnEnglish */

export function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/[_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function speakEnglish(
  text: string,
  handlers?: {
    onStart?: () => void
    onEnd?: () => void
    onError?: () => void
  }
): boolean {
  if (!('speechSynthesis' in window) || !text.trim()) {
    console.warn('Web Speech API is not supported or text is empty.')
    return false
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.95

  const voices = window.speechSynthesis.getVoices()
  const enVoice =
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en'))
  if (enVoice) {
    utterance.voice = enVoice
  }

  utterance.onstart = () => handlers?.onStart?.()
  utterance.onend = () => handlers?.onEnd?.()
  utterance.onerror = () => handlers?.onError?.()

  window.speechSynthesis.speak(utterance)
  return true
}
