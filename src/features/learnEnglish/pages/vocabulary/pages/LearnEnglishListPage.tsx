import { useNavigate } from 'react-router-dom'
import {
  BookOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import { useLearnTopicsQuery } from '../../../hooks/useLearnTopicQuery'
import Skeleton from '../../../components/ui/Skeleton'
import LessonCard from '../../../components/ui/LessonCard/LessonCard'
import { LE_COLORS } from '../../../styles/colors'
import '../style/index.scss'

export default function LearnEnglishListPage() {
  const { topics = [], loading } = useLearnTopicsQuery()
  const navigate = useNavigate()

  const getTopicState = (topicId: string) => {
    const rawProgress = localStorage.getItem(`learn_progress_${topicId}`)
    if (!rawProgress) return { status: 'NOT_STARTED', score: null }
    try {
      const parsed = JSON.parse(rawProgress)
      return {
        status: parsed.status || 'NOT_STARTED',
        score: parsed.score ?? null,
      }
    } catch {
      return { status: 'NOT_STARTED', score: null }
    }
  }

  return (
    <div className="learn-english">
      <div className="learn-english__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
        <span style={{ fontSize: '22px', fontWeight: 900, color: LE_COLORS.ink, letterSpacing: '-0.5px', fontFamily: LE_COLORS.fontDisplay }}>
          VOCABULARY
        </span>

        <button
          onClick={() => navigate('/learn-english/history')}
          style={{
            background: 'none',
            border: 'none',
            color: LE_COLORS.ink,
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'all var(--transition-fast)',
            flexShrink: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = LE_COLORS.gray700
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = LE_COLORS.ink
          }}
          title="Lịch sử làm bài"
        >
          <HistoryOutlined />
        </button>
      </div>

      {loading ? (
        <div className="learn-english__list">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="lesson-card lesson-card--skeleton"
              style={{
                '--card-bg': LE_COLORS.gray50,
                cursor: 'default',
                opacity: 0.8
              } as React.CSSProperties}
            >
              <div className="lesson-card__top">
                <div className="lesson-card__badge" style={{ background: LE_COLORS.gray250, borderColor: LE_COLORS.gray250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Skeleton width="100%" height="100%" borderRadius="0" />
                </div>
                <div className="lesson-card__status" style={{ background: LE_COLORS.gray250, borderColor: LE_COLORS.gray250, width: '80px', height: '27px', padding: 0, overflow: 'hidden' }}>
                  <Skeleton width="100%" height="100%" borderRadius="0" />
                </div>
              </div>

              <h3 className="lesson-card__title" style={{ height: '25px', overflow: 'hidden' }}>
                <Skeleton width="75%" height="100%" borderRadius="0" />
              </h3>

              <div className="lesson-card__stats">
                <div className="lesson-card__stat" style={{ background: LE_COLORS.gray50, display: 'flex', flexDirection: 'column', height: '62px', boxSizing: 'border-box', justifyContent: 'center' }}>
                  <Skeleton width="30%" height="20px" style={{ marginBottom: '2px' }} />
                  <Skeleton width="55%" height="10px" />
                </div>
                <div className="lesson-card__stat" style={{ background: LE_COLORS.gray50, display: 'flex', flexDirection: 'column', height: '62px', boxSizing: 'border-box', justifyContent: 'center' }}>
                  <Skeleton width="30%" height="20px" style={{ marginBottom: '2px' }} />
                  <Skeleton width="55%" height="10px" />
                </div>
              </div>

              <div className="lesson-card__cta" style={{ width: '100px', height: '36px', padding: 0, overflow: 'hidden', background: LE_COLORS.gray250, borderColor: LE_COLORS.gray250 }}>
                <Skeleton width="100%" height="100%" borderRadius="0" />
              </div>
            </div>
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="learn-english__list-empty">
          <BookOutlined style={{ fontSize: '48px', color: LE_COLORS.ink, marginBottom: '16px' }} />
          <p style={{ color: LE_COLORS.gray700, margin: 0, fontFamily: LE_COLORS.fontDisplay, fontWeight: 700 }}>Chưa có chủ đề học tập nào. Vui lòng quay lại sau!</p>
        </div>
      ) : (
        <div className="learn-english__list">
          {topics.map((topic, index) => {
            const state = getTopicState(topic.id)

            return (
              <LessonCard
                key={topic.id}
                topic={topic}
                index={index}
                status={state.status as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'}
                score={state.score}
                onClick={() => navigate(`/learn-english/${topic.id}`)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
