import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import DocumentCard from '../components/DocumentCard'
import { useGetDocuments } from '../hooks/useExamDocuments'
import CongDongOnThiLayout from '../layouts/CongDongOnThiLayout'
import Pagination from '../../../components/ui/Pagination'
import { FileOutlined } from '@ant-design/icons'
import '../style/index.scss'

export default function CongDongOnThiSearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const tagsParam = searchParams.get('tags') || ''

  const [searchValue, setSearchValue] = useState(q)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Sync state with url query parameters
  useEffect(() => {
    setSearchValue(q)
    setCurrentPage(1)
  }, [q, tagsParam])

  // Fetch all documents from BE to filter
  const { data: documents = [], isLoading } = useGetDocuments()

  // Filter documents based on query or tags
  const filteredDocuments = documents.filter((doc) => {
    if (tagsParam) {
      const searchTags = tagsParam.split(',').map((t) => t.trim().toLowerCase())
      const docTags = (doc.tags || []).map((t) => t.trim().toLowerCase())
      return docTags.some((tag) => searchTags.includes(tag))
    }
    if (q) {
      const query = q.toLowerCase()
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.author.toLowerCase().includes(query) ||
        doc.subject.toLowerCase().includes(query) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  // Paginated documents
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const getPageTitle = () => {
    if (tagsParam) {
      return `Tài liệu liên quan các tag: ${tagsParam.split(',').join(', ')}`
    }
    if (q) {
      return `Kết quả tìm kiếm cho: "${q}"`
    }
    return 'Tất cả tài liệu tìm kiếm'
  }

  return (
    <CongDongOnThiLayout
      activeDocId={null}
      onBack={() => navigate('/congdongonthi')}
      searchValue={searchValue}
      onSearchChange={(val) => {
        setSearchValue(val)
        if (val) {
          // If search tags were active, clear them when user types a new text search
          setSearchParams({ q: val })
        } else {
          setSearchParams({})
        }
      }}
    >
      {isLoading ? (
        <div className="exam-workspace-loading">
          <div className="exam-workspace-loading__spinner" />
          <p>Đang tìm kiếm tài liệu...</p>
        </div>
      ) : (
        <div className="exam-list-view">
          <div className="exam-list-view__header" style={{ marginBottom: '24px' }}>
            <div>
              <h1 className="exam-list-view__title">{getPageTitle()}</h1>
              <p className="exam-list-view__subtitle">
                Tìm thấy {filteredDocuments.length} tài liệu phù hợp
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/congdongonthi')}
              className="exam-list-view__add-btn"
            >
              Quay lại trang chủ
            </Button>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="exam-workspace-empty" style={{ padding: '80px 0' }}>
              <FileOutlined style={{ fontSize: '48px', color: 'var(--exam-text-muted)', marginBottom: '16px' }} />
              <h2>Không tìm thấy tài liệu nào</h2>
              <p>Hãy thử tìm kiếm với từ khóa khác hoặc quay lại trang chủ.</p>
              <Button variant="primary" onClick={() => navigate('/congdongonthi')} style={{ marginTop: '16px' }}>
                Quay lại trang chủ ôn thi
              </Button>
            </div>
          ) : (
            <>
              <div className="exam-list-grid">
                {paginatedDocuments.map((doc) => (
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
    </CongDongOnThiLayout>
  )
}
