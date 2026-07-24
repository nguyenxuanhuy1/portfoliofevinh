import { useState, useEffect } from 'react'
import { LE_COLORS } from '../../../styles/colors'

interface GradingLoadingScreenProps {
  totalQuestions: number
}

const DOT_COLORS = [LE_COLORS.coral, LE_COLORS.purple, LE_COLORS.mint] as const

export default function GradingLoadingScreen({ totalQuestions }: GradingLoadingScreenProps) {
  const total = totalQuestions

  const [fakeCount, setFakeCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

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

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => {
        document.dispatchEvent(new CustomEvent('grading:done'))
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isFinished])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        width: '90%',
        maxWidth: '320px',
        background: LE_COLORS.yellow,
        border: `3px solid ${LE_COLORS.ink}`,
        boxShadow: `8px 8px 0 ${LE_COLORS.ink}`,
        padding: '36px 24px',
        boxSizing: 'border-box',
        fontFamily: LE_COLORS.font,
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        {DOT_COLORS.map((color, i) => (
          <div
            key={color}
            style={{
              width: '14px',
              height: '14px',
              background: color,
              border: `2px solid ${LE_COLORS.ink}`,
              animation: `nbPulse 0.9s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes nbPulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: LE_COLORS.fontDisplay,
            fontSize: '22px',
            color: LE_COLORS.ink,
            textTransform: 'uppercase',
            lineHeight: 1.2,
          }}
        >
          {isFinished ? 'Hoàn tất!' : 'Đang chấm điểm'}
        </div>
        <div style={{ fontSize: '13px', color: LE_COLORS.gray850, marginTop: '8px', fontWeight: 600 }}>
          {isFinished ? 'Đang tổng hợp kết quả...' : 'Vui lòng chờ trong giây lát'}
        </div>
      </div>

      <div
        style={{
          fontFamily: LE_COLORS.fontDisplay,
          fontSize: '14px',
          color: LE_COLORS.ink,
          background: LE_COLORS.white,
          border: `2px solid ${LE_COLORS.ink}`,
          padding: '6px 14px',
        }}
      >
        {fakeCount} / {total} câu
      </div>
    </div>
  )
}
