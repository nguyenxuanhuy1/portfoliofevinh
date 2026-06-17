import React from 'react'
import type { LearnTopic } from '../../../types/LearnEnglish'
import { parseTopicStats } from '../../../utils/lessonUtils'
import './LessonCard.scss'

interface LessonCardProps {
  topic: LearnTopic
  index: number
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  score?: number | null
  onClick: () => void
}

export default function LessonCard({ topic, index, status, onClick }: LessonCardProps) {
  const { vocabCount, exerciseCount } = parseTopicStats(topic)
  
  // Format topic index like "01", "02", etc.
  const formattedIndex = String(index + 1).padStart(2, '0')

  // Map status values to class modifiers and display text
  let statusClass = 'lesson-card__status--locked'
  let statusText = 'Chưa mở'
  let ctaText = 'Bắt đầu'

  if (status === 'COMPLETED') {
    statusClass = 'lesson-card__status--done'
    statusText = 'Hoàn thành'
    ctaText = 'Xem lại'
  } else if (status === 'IN_PROGRESS') {
    statusClass = 'lesson-card__status--progress'
    statusText = 'Đang học'
    ctaText = 'Tiếp tục'
  }

  // Neo-Brutalist random background colors
  const neoColors = ['#FF6D6D', '#5887FF', '#4ADE80', '#FACC15', '#FB923C', '#F472B6', '#C084FC', '#2DD4BF']
  const cardBg = neoColors[index % neoColors.length]

  return (
    <div 
      className="lesson-card" 
      style={{ '--card-bg': cardBg } as React.CSSProperties}
      onClick={onClick}
      tabIndex={0}
    >
      <div className="lesson-card__top">
        <div className="lesson-card__badge">{formattedIndex}</div>
        <div className={`lesson-card__status ${statusClass}`}>{statusText}</div>
      </div>
      
      <h3 className="lesson-card__title">{topic.name}</h3>
      
      <div className="lesson-card__stats">
        <div className="lesson-card__stat">
          <span className="lesson-card__stat-value">{exerciseCount}</span>
          <span className="lesson-card__stat-label">Bài học</span>
        </div>
        <div className="lesson-card__stat">
          <span className="lesson-card__stat-value">{vocabCount}</span>
          <span className="lesson-card__stat-label">Từ mới</span>
        </div>
      </div>
      
      <button className="lesson-card__cta">
        {ctaText} →
      </button>
    </div>
  )
}
