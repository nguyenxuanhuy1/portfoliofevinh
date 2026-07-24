import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Modal from '../../../components/ui/Modal'
import message from '../../../../../components/ui/Message'
import Button from '../../../components/ui/Button'
import { LE_CARD_COLORS, LE_COLORS } from '../../../styles/colors'
import '../style/index.scss'

interface HistoryItem {
  id: string
  topicId: string
  topicName: string
  submittedAt: string
  score: number
}

export default function LearnEnglishHistoryPage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false)

  useEffect(() => {
    const rawHistory = localStorage.getItem('learn_history')
    if (rawHistory) {
      try {
        const parsed = JSON.parse(rawHistory)
        if (Array.isArray(parsed)) {
          setHistory(parsed.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()))
        }
      } catch (err) {
        console.error('Error loading history:', err)
      }
    }
  }, [])

  const confirmClearHistory = () => {
    localStorage.removeItem('learn_history')
    setHistory([])
    setIsClearHistoryModalOpen(false)
    message.success('Đã xóa toàn bộ lịch sử học tập thành công!')
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    } catch {
      return dateStr
    }
  }

  return (
    <div className="learn-english">
      <div className="learn-english__header" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={() => navigate('/learn-english')}
            style={{
              background: 'none',
              border: 'none',
              color: LE_COLORS.ink,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: 0,
              fontFamily: LE_COLORS.fontDisplay,
              fontSize: '22px',
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
            }}
          >
            <ArrowLeftOutlined style={{ fontSize: '18px' }} /> Lịch sử
          </button>

          {history.length > 0 && (
            <Button variant="danger" size="sm" onClick={() => setIsClearHistoryModalOpen(true)}>
              <DeleteOutlined /> Xóa lịch sử
            </Button>
          )}
        </div>
      </div>

      <div className="learn-english__history-section" style={{ width: '100%' }}>
        {history.length === 0 ? (
          <div className="learn-english__history-empty">
            <p style={{ color: LE_COLORS.ink, margin: 0, fontFamily: LE_COLORS.fontDisplay, fontSize: '16px', textTransform: 'uppercase' }}>
              Chưa có lịch sử làm bài
            </p>
            <p style={{ color: LE_COLORS.gray850, margin: '12px 0 0', fontWeight: 600, fontSize: '13px' }}>
              Hãy chọn một chủ đề để bắt đầu học tập!
            </p>
          </div>
        ) : (
          <div className="learn-english__history-list">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="learn-english__history-item"
                style={{ '--history-bg': LE_CARD_COLORS[index % LE_CARD_COLORS.length] } as React.CSSProperties}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                  <h3 className="learn-english__history-title">{item.topicName}</h3>
                  <div className="learn-english__history-meta">
                    Hoàn thành: {formatDate(item.submittedAt)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                  <span
                    className={`learn-english__result-score ${item.score >= 70 ? 'learn-english__result-score--pass' : 'learn-english__result-score--fail'}`}
                  >
                    {item.score}/100
                  </span>

                  <button
                    type="button"
                    className="learn-english__history-cta"
                    onClick={() => navigate(`/learn-english/${item.topicId}`)}
                  >
                    Xem lại →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={isClearHistoryModalOpen}
        title={<span style={{ fontFamily: LE_COLORS.fontDisplay, textTransform: 'uppercase' }}>Xóa lịch sử</span>}
        onCancel={() => setIsClearHistoryModalOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px' }}>
            <Button variant="secondary" onClick={() => setIsClearHistoryModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmClearHistory}>
              Xóa
            </Button>
          </div>
        }
      >
        <p style={{ margin: '16px 0', fontSize: '15px', lineHeight: '24px', color: LE_COLORS.ink, fontWeight: 500 }}>
          Bạn có chắc chắn muốn xóa toàn bộ lịch sử làm bài tiếng Anh? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  )
}
