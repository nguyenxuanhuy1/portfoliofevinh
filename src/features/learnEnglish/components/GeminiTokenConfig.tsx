import React from 'react'
import { message } from 'antd'

interface GeminiTokenConfigProps {
  newToken: string;
  setNewToken: (val: string) => void;
  tokens: Array<{ id: string; value: string }>;
  setTokens: React.Dispatch<React.SetStateAction<Array<{ id: string; value: string }>>>;
}

export default function GeminiTokenConfig({
  newToken,
  setNewToken,
  tokens,
  setTokens
}: GeminiTokenConfigProps) {
  return (
    <div className="screen active">
      <div className="token-config-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
        <p className="drawer-muted" style={{ fontSize: '12px', color: '#888888', lineHeight: '18px', margin: 0 }}>
          Lưu trữ khóa API Gemini cá nhân trong thiết bị của bạn để gửi yêu cầu chấm bài làm trực tiếp bằng mô hình AI.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="password"
            className="drawer-input"
            placeholder="Nhập API Key (AIzaSy...)"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
          />

          <button 
            className="next-btn"
            style={{ margin: 0, width: '100%' }}
            onClick={() => {
              if (!newToken.trim()) return
              const val = newToken.trim()
              const newT = { id: Date.now().toString(), value: val }
              const updated = [...tokens, newT]
              setTokens(updated)
              localStorage.setItem('learn_tokens', JSON.stringify(updated))
              setNewToken('')
              message.success('Đã lưu khóa API thành công!')
            }}
          >
            Lưu Key mới
          </button>
        </div>

        {tokens.length > 0 && (
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-card-border)', paddingTop: '16px' }}>
            <div className="ex-instruction" style={{ marginBottom: '12px' }}>Khóa đang lưu</div>
            <div className="vocab-list">
              {tokens.map((tok) => (
                <div key={tok.id} className="vocab-card" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                    ••••••••{tok.value.slice(-8)}
                  </span>
                  <button 
                    onClick={() => {
                      const updated = tokens.filter((t) => t.id !== tok.id)
                      setTokens(updated)
                      localStorage.setItem('learn_tokens', JSON.stringify(updated))
                      message.success('Đã gỡ API Key thành công!')
                    }}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#FF3B5C', 
                      cursor: 'pointer', 
                      fontSize: '12px',
                      padding: 0,
                      fontWeight: 500
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
