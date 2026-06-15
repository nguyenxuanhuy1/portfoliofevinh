import { 
  DownloadOutlined, 
  EyeOutlined, 
  ClockCircleOutlined,
  FilePdfOutlined, 
  FileWordOutlined, 
  FileZipOutlined, 
  FileOutlined 
} from '@ant-design/icons'
import type { ExamDocument } from '../types'
import { formatRelativeTime } from '../utils/time'

interface DocumentCardProps {
  document: ExamDocument
  isActive: boolean
  onClick: () => void
}



export default function DocumentCard({ document, isActive, onClick }: DocumentCardProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FilePdfOutlined />
      case 'DOCX':
        return <FileWordOutlined />
      case 'ZIP':
        return <FileZipOutlined />
      default:
        return <FileOutlined />
    }
  }

  return (
    <div
      onClick={onClick}
      className={`exam-doc-card ${isActive ? 'exam-doc-card--active' : ''}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--exam-card-bg)',
        border: isActive ? '1px solid var(--exam-primary)' : '0.5px solid var(--exam-border)',
        borderRadius: 'var(--exam-border-radius)',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
        boxSizing: 'border-box',
        transition: 'all var(--exam-transition)',
      }}
    >
      {/* Header row: category tag (pill, left) + file type badge (right, bordered) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span 
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--exam-primary)',
              backgroundColor: 'var(--exam-primary-light)',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '0.5px solid rgba(0, 138, 187, 0.15)',
            }}
          >
            {document.subject}
          </span>
          {document.level === 1 && (
            <span 
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#ea4335',
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                lineHeight: '1.2',
              }}
            >
              HOT
            </span>
          )}
        </div>
        <span 
          style={{
            fontSize: '11px',
            color: 'var(--exam-text-secondary)',
            border: '0.5px solid var(--exam-border)',
            padding: '3px 8px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {getFileIcon(document.fileType)} {document.fileType}
        </span>
      </div>

      {/* Content row: title (15px, weight 500) and subtitle (13px, muted) stacked, no timestamp here */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
        <h4 
          style={{ 
            fontSize: '15px', 
            fontWeight: 500, 
            color: 'var(--exam-text)', 
            margin: 0,
            lineHeight: '1.35',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {document.title}
        </h4>
        <span 
          style={{ 
            fontSize: '13px', 
            color: 'var(--exam-text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {document.description || 'Không có mô tả'}
        </span>
      </div>

      {/* Bottom row (no top border): stats on the left — view count and download count inline, each with a leading icon, gap 10px between them. Timestamp on the right with a clock icon, muted, small (11px). */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span 
            style={{ 
              fontSize: '12px', 
              color: 'var(--exam-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <EyeOutlined style={{ color: 'var(--exam-primary)' }} /> {document.views}
          </span>
          <span 
            style={{ 
              fontSize: '12px', 
              color: 'var(--exam-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <DownloadOutlined style={{ color: 'var(--exam-primary)' }} /> {document.downloads}
          </span>
        </div>
        <span 
          style={{ 
            fontSize: '11px', 
            color: 'var(--exam-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <ClockCircleOutlined style={{ fontSize: '10px', color: 'var(--exam-primary)' }} /> {formatRelativeTime(document.createdAt)}
        </span>
      </div>
    </div>
  )
}
