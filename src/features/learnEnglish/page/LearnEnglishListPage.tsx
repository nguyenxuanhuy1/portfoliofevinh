import { useNavigate } from 'react-router-dom'
import {
  BookOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  PlayCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import { useLearnTopicsQuery } from '../../../hooks/useLearnTopicQuery'
import Skeleton from '../../../components/ui/Skeleton'
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

  const renderStatusBadge = (status: string, score: number | null) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="learn-english__badge learn-english__badge--completed">
            <CheckCircleOutlined style={{ marginRight: '4px' }} />
            Hoàn thành {score !== null ? `(${score}đ)` : ''}
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span className="learn-english__badge learn-english__badge--inprogress">
            <FieldTimeOutlined style={{ marginRight: '4px' }} />
            Đang học
          </span>
        )
      case 'NOT_STARTED':
      default:
        return (
          <span className="learn-english__badge learn-english__badge--notstarted">
            <PlayCircleOutlined style={{ marginRight: '4px' }} />
            Chưa bắt đầu
          </span>
        )
    }
  }

  return (
    <div className="learn-english">
      <div className="learn-english__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
        <span style={{ fontSize: '22px', fontWeight: 400, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
          Vocabulary
        </span>

        {/* Nút icon Lịch sử làm bài */}
        <button
          onClick={() => navigate('/learn-english/history')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
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
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
          title="Lịch sử làm bài"
        >
          <HistoryOutlined />
        </button>
      </div>

      {loading ? (
        <div className="learn-english__list">
          {Array.from({ length: 1 }).map((_, idx) => (
            <div key={idx} className="learn-english__btn-3d" style={{ opacity: 0.6, cursor: 'default' }}>
              <Skeleton
                title={false}
                paragraph={false}
                height="20px"
              />
            </div>
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed var(--color-card-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-card-bg)' }}>
          <BookOutlined style={{ fontSize: '48px', color: 'var(--color-primary)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Chưa có chủ đề học tập nào. Vui lòng quay lại sau!</p>
        </div>
      ) : (
        <div className="learn-english__list">
          {topics.map((topic) => {
            const state = getTopicState(topic.id)

            return (
              <button
                key={topic.id}
                className="learn-english__btn-3d"
                onClick={() => navigate(`/learn-english/${topic.id}`)}
              >
                <span className="learn-english__btn-3d-title">{topic.name}</span>
                <div className="learn-english__btn-3d-status">
                  {renderStatusBadge(state.status, state.score)}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
