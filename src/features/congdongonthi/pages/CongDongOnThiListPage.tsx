import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import UploadModal from '../components/UploadModal'
import DocumentCard from '../components/DocumentCard'
import { useGetDocuments, useUploadDocument, useGetSubjects } from '../hooks/useExamDocuments'
import CongDongOnThiLayout from '../layouts/CongDongOnThiLayout'
import message from '../../../components/ui/Message/Message'
import Pagination from '../../../components/ui/Pagination'
import { EyeOutlined, DownloadOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { formatRelativeTime } from '../utils/time'
import '../style/index.scss'

export default function CongDongOnThiListPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Fetch documents from BE
  const { data: documents = [], isLoading } = useGetDocuments()
  const { data: subjects = [] } = useGetSubjects()
  const uploadMutation = useUploadDocument()

  const hotDocs = documents.filter((doc) => doc.level === 1)
  const spotlightDoc = hotDocs.length > 0
    ? hotDocs.reduce((prev, current) => (prev.views > current.views) ? prev : current, hotDocs[0])
    : null

  const getSubjectCount = (subject: string) => {
    const listToCount = spotlightDoc
      ? documents.filter((doc) => doc.id !== spotlightDoc.id)
      : documents

    if (subject === 'all') return listToCount.length
    return listToCount.filter((doc) => doc.subject === subject).length
  }

  const filteredDocuments = documents.filter((doc) => {
    if (activeTab !== 'all' && doc.subject !== activeTab) return false
    if (spotlightDoc && doc.id === spotlightDoc.id) return false
    return true
  })

  const handleUploadSubmit = (values: any) => {
    uploadMutation.mutate(values, {
      onSuccess: () => {
        message.success('Cảm ơn đóng góp của bạn! Tài liệu đã được tải lên thành công và đang chờ kiểm duyệt.')
        setIsUploadModalOpen(false)
      },
      onError: (err) => {
        message.error('Gặp lỗi khi đóng góp tài liệu: ' + err.message)
      }
    })
  }

  return (
    <CongDongOnThiLayout
      activeDocId={null}
      onBack={() => navigate('/')}
      searchValue=""
      onSearchChange={(val) => {
        navigate(`/congdongonthi/search?q=${encodeURIComponent(val)}`)
      }}
    >
      {isLoading ? (
        <div className="exam-workspace-loading">
          <div className="exam-workspace-loading__spinner" />
          <p>Đang tải danh sách tài liệu từ máy chủ...</p>
        </div>
      ) : (
        <div className="exam-list-view">

          {/* Spotlight Card */}
          {spotlightDoc && (
            <div className="exam-spotlight-card">
              <div className="exam-spotlight-card__badge">HOT</div>
              <div className="exam-spotlight-card__content">
                <span className="exam-spotlight-card__subject">
                  {spotlightDoc.subject}
                </span>
                <h3 className="exam-spotlight-card__title">{spotlightDoc.title}</h3>
                <p className="exam-spotlight-card__desc">{spotlightDoc.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--exam-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <EyeOutlined style={{ color: 'var(--exam-primary)' }} /> {spotlightDoc.views} lượt xem
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--exam-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <DownloadOutlined style={{ color: 'var(--exam-primary)' }} /> {spotlightDoc.downloads} lượt tải
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--exam-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ClockCircleOutlined style={{ fontSize: '10px', color: 'var(--exam-primary)' }} /> {formatRelativeTime(spotlightDoc.createdAt)}
                  </span>
                </div>
              </div>
              <div className="exam-spotlight-card__action">
                <Button variant="primary" onClick={() => navigate(`/congdongonthi/${spotlightDoc.id}`)}>
                  Khám phá ngay
                </Button>
              </div>
            </div>
          )}

          {/* Subject Navigation Tabs */}
          <div className="exam-tab-nav">
            <div
              className={`exam-tab-nav__pill ${activeTab === 'all' ? 'exam-tab-nav__pill--active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả ({getSubjectCount('all')})
            </div>
            {subjects.map((sub) => (
              <div
                key={sub}
                className={`exam-tab-nav__pill ${activeTab === sub ? 'exam-tab-nav__pill--active' : ''}`}
                onClick={() => setActiveTab(sub)}
              >
                {sub} ({getSubjectCount(sub)})
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="exam-workspace-empty">
              <h2>Không tìm thấy tài liệu nào</h2>
              <p>Hãy thử chọn môn học khác hoặc nhập từ khóa tìm kiếm mới.</p>
            </div>
          ) : (
            <>
              <div className="exam-list-grid">
                {filteredDocuments.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    isActive={false}
                    onClick={() => navigate(`/congdongonthi/${doc.id}`)}
                  />
                ))}
              </div>

              <div className="exam-list-pagination">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredDocuments.length}
                  onChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  hideOnSinglePage={true}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Contribute Upload Modal */}
      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        loading={uploadMutation.isPending}
      />
    </CongDongOnThiLayout>
  )
}
