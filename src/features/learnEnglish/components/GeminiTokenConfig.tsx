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
      <div className="vocab-list" style={{ gap: '12px', marginTop: '16px' }}>
        <p className="drawer-muted" style={{ fontSize: '11px', color: '#555555', lineHeight: '16px', margin: 0 }}>
          Lưu trữ khóa API Gemini cá nhân trong thiết bị của bạn để gửi yêu cầu chấm bài làm trực tiếp bằng mô hình AI.
        </p>

        <input 
          type="password"
          className="drawer-input"
          placeholder="Nhập API Key (AIzaSy...)"
          value={newToken}
          onChange={(e) => setNewToken(e.target.value)}
        />

        <button 
          className="next-btn"
          style={{ marginTop: '4px' }}
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

        {tokens.length > 0 && (
          <div style={{ marginTop: '16px', borderTop: '1px solid #1a1a1a', paddingTop: '12px' }}>
            <div className="ex-instruction" style={{ marginBottom: '8px' }}>Khóa đang lưu</div>
            {tokens.map((tok) => (
              <div key={tok.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'var(--color-card-bg)', 
                padding: '10px 14px', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--color-card-border)', 
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: '8px'
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
        )}
      </div>
    </div>
  )
}
