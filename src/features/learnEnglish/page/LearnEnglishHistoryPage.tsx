import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Modal from '../../../components/ui/Modal'
import message from '../../../components/ui/Message'
import Button from '../ui/Button'
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

  // Load history from localStorage
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

  const handleClearHistory = () => {
    Modal.confirm({
      title: 'Xóa lịch sử học tập',
      content: 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử làm bài tiếng Anh? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        localStorage.removeItem('learn_history')
        setHistory([])
        message.success('Đã xóa toàn bộ lịch sử học tập thành công!')
      }
    })
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
      <div className="learn-english__header" style={{ marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              onClick={() => navigate('/learn-english')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
                fontWeight: 400, // Làm chữ mỏng, không in đậm
                fontSize: '13px'
              }}
            >
              <ArrowLeftOutlined /> Quay lại
            </Button>

            {history.length > 0 && (
              <Button
                onClick={handleClearHistory}
                className="learn-english__token-delete-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: 'none',
                  border: '1px solid var(--color-card-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <DeleteOutlined /> Xóa lịch sử
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="learn-english__history-section" style={{ width: '100%' }}>
        {history.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '32px 0', margin: 0 }}>
            Bạn chưa làm chủ đề nào. Hãy quay lại chọn một chủ đề để bắt đầu học tập nhé!
          </p>
        ) : (
          <div className="learn-english__history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((item) => (
              <div
                key={item.id}
                className="learn-english__history-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--color-card-bg)',
                  border: '1px solid var(--color-card-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  gap: '16px'
                }}
              >
                {/* Cột trái: 2 item chữ flex (chủ đề + thời gian bên dưới) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    fontSize: '15px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.topicName}
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                    Hoàn thành: {formatDate(item.submittedAt)}
                  </div>
                </div>

                {/* Cột phải: 2 item flex (điểm/100 bên trên, nút xem lại ở dưới) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  <span
                    className={`learn-english__result-score ${item.score >= 70 ? 'learn-english__result-score--pass' : 'learn-english__result-score--fail'}`}
                    style={{
                      fontSize: '13px',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    {item.score}/100
                  </span>

                  <Button
                    onClick={() => navigate(`/learn-english/${item.topicId}`)}
                    className="learn-english__token-delete-btn"
                    style={{
                      fontSize: '12px',
                      padding: '6px 14px',
                      border: '1px solid var(--color-card-border)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Xem lại
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
