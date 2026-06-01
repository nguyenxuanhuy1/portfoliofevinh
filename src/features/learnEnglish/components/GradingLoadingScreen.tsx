import { useState, useEffect } from 'react'

interface GradingLoadingScreenProps {
  totalQuestions: number
}

export default function GradingLoadingScreen({ totalQuestions }: GradingLoadingScreenProps) {
  // inject from quiz data — do not hardcode
  const total = totalQuestions

  const [fakeCount, setFakeCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  // fake progress — swap with real stream event
  useEffect(() => {
    if (total === 0) return

    const stepTime = Math.max(100, Math.min(400, 2000 / total))
    const interval = setInterval(() => {
      setFakeCount((prev) => {
        if (prev >= total) {
          clearInterval(interval)
          setIsFinished(true)
          return total
        }
        return prev + 1
      })
    }, stepTime)

    return () => clearInterval(interval)
  }, [total])

  // Trigger grading:done custom event after 800ms when counter reaches total
  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => {
        const event = new CustomEvent('grading:done')
        document.dispatchEvent(event)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isFinished])

  // Keyframes and CSS class styles for animations
  const dotAnimationStyles = `
    @keyframes dotScalePulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.15;
      }
      50% {
        transform: scale(1.3);
        opacity: 1;
      }
    }
    .grading-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--color-primary, #FF3B5C);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .grading-dot.pulsing {
      animation: dotScalePulse 1.2s infinite ease-in-out;
    }
    .grading-dot.static {
      opacity: 1 !important;
      transform: scale(1) !important;
      animation: none !important;
    }
  `

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
      width: '100%',
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif'
    }}>
      <style dangerouslySetInnerHTML={{ __html: dotAnimationStyles }} />

      {/* Section 1 — Dots */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div className="grading-dot pulsing" style={{ animationDelay: '0s' }} />
        <div className="grading-dot pulsing" style={{ animationDelay: '0.2s' }} />
        <div className="grading-dot pulsing" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Section 2 — Text block */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--color-primary, #D91B41)',
          lineHeight: '1.4'
        }}>
          {isFinished ? 'Hoàn tất!' : 'Đang chấm điểm'}
        </div>
        <div style={{
          fontSize: '15px',
          color: 'var(--color-text-secondary, #4A5568)',
          lineHeight: '1.4',
          fontWeight: 500
        }}>
          {isFinished ? 'Đang tổng hợp kết quả...' : 'Vui lòng chờ trong giây lát'}
        </div>
      </div>

      {/* Section 3 — Counter */}
      <div style={{
        fontFamily: 'SFMono-Regular, Consolas, Menlo, monospace',
        fontSize: '13px',
        color: 'var(--color-text-secondary, #555555)',
        fontWeight: 500
      }}>
        {fakeCount} / {total} câu
      </div>
    </div>
  )
}
