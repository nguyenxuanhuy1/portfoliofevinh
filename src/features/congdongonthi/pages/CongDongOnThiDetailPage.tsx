import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileZipOutlined,
  FileOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  SendOutlined,
  RobotOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { marked } from 'marked'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Drawer from '../components/ui/Drawer'
import DocumentCard from '../components/DocumentCard'
import { useGetDocumentById, useGetDocuments } from '../hooks/useExamDocuments'
import CongDongOnThiLayout from '../layouts/CongDongOnThiLayout'
import message from '../../../components/ui/Message/Message'
import { congDongOnThiService } from '../services/congDongOnThiService'
import { mergePdfBuffers } from '../utils/pdf'
import '../style/index.scss'

interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
}

export default function CongDongOnThiDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [activePage, setActivePage] = useState(0)
  const [previewMode, setPreviewMode] = useState<'file' | 'md'>('file')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false)
  const [detailSearchValue, setDetailSearchValue] = useState('')
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const mdContainerRef = useRef<HTMLDivElement>(null)
  const [parsedHtml, setParsedHtml] = useState('')
  const [isMdLoading, setIsMdLoading] = useState(false)
  const [isMerging, setIsMerging] = useState(false)

  // Fetch document details by ID from BE
  const { data: activeDoc, isLoading: isDocLoading, error: docError } = useGetDocumentById(id)

  // Fetch all documents for "Related Documents" sidebar
  const { data: documents = [] } = useGetDocuments()

  const renderChatBot = (isDrawer = false) => (
    <div className={`exam-chat-container ${isDrawer ? 'exam-chat-container--drawer' : ''}`} style={isDrawer ? { height: '100%', border: 'none', borderRadius: 0, marginBottom: 0 } : undefined}>
      <div className="exam-chat-header">
        <div className="exam-chat-header__title">
          <RobotOutlined className="exam-chat-header__icon" />
          <div>
            <h4>Trợ lý Học Tập AI</h4>
            <span>Online • Đọc tài liệu này</span>
          </div>
        </div>
        <div className="exam-chat-header__beacon" />
      </div>

      <div ref={chatMessagesRef} className="exam-chat-messages">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`exam-chat-bubble exam-chat-bubble--${msg.sender}`}
          >
            <div className="exam-chat-bubble__header">
              {msg.sender === 'ai' ? 'Trợ lý AI' : 'Bạn'}
            </div>
            <div className="exam-chat-bubble__body" style={{ whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="exam-chat-bubble exam-chat-bubble--ai exam-chat-bubble--loading">
            <span className="exam-chat-bubble__dot" />
            <span className="exam-chat-bubble__dot" />
            <span className="exam-chat-bubble__dot" />
          </div>
        )}
      </div>

      <form onSubmit={handleSendChat} className="exam-chat-form">
        <Input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Hỏi AI về công thức, đáp án hoặc lý thuyết..."
          className="exam-chat-input"
          disabled={isStreaming}
        />
        <button
          type="submit"
          disabled={!chatInput.trim() || isStreaming}
          className="exam-chat-send-btn"
        >
          <SendOutlined />
        </button>
      </form>
    </div>
  )

  // Scroll markdown container to top when page changes
  useEffect(() => {
    if (mdContainerRef.current) {
      mdContainerRef.current.scrollTop = 0
    }
  }, [activePage])

  // Parse Markdown to HTML for the active page
  useEffect(() => {
    if (previewMode === 'md' && activeDoc?.pages && activeDoc.pages[activePage]) {
      setIsMdLoading(true)
      const content = activeDoc.pages[activePage]
      try {
        const html = marked.parse(content)
        if (html instanceof Promise) {
          html
            .then((resolvedHtml) => {
              setParsedHtml(resolvedHtml)
              setIsMdLoading(false)
            })
            .catch((err) => {
              console.error(err)
              setIsMdLoading(false)
            })
        } else {
          setParsedHtml(html)
          setIsMdLoading(false)
        }
      } catch (err) {
        console.error(err)
        setIsMdLoading(false)
      }
    } else {
      setParsedHtml('')
      setIsMdLoading(false)
    }
  }, [previewMode, activeDoc, activePage])

  // Reset page, scroll to top, and reset chat when active document changes
  useEffect(() => {
    if (!activeDoc) return
    setActivePage(0)
    setPreviewMode('file')
    setChatMessages([
      {
        id: 'init',
        sender: 'ai',
        text: `Chào bạn! Tôi đã phân tích xong tài liệu "${activeDoc.title}". Bạn có câu hỏi nào về phần nội dung hoặc cần giải chi tiết câu hỏi nào không?`,
      },
    ])
    window.scrollTo(0, 0)
  }, [id, activeDoc?.title])

  // Auto scroll chat messages container to bottom without scrolling window
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chatMessages])

  const handleDownload = async () => {
    if (!activeDoc) return
    try {
      if (activeDoc.downloadUrl && activeDoc.downloadUrl !== '#') {
        const urls = activeDoc.downloadUrl
        const urlList = Array.isArray(urls) ? urls : [urls]
        const validUrls = urlList.filter(url => url && url !== '#')

        if (validUrls.length === 0) {
          message.error('Không tìm thấy đường dẫn tải file.')
          return
        }

        // If it's a multi-part PDF file, merge them on the frontend
        if (validUrls.length > 1 && activeDoc.fileType?.toUpperCase() === 'PDF') {
          setIsMerging(true)
          try {
            // Fetch all chunks in parallel
            const promises = validUrls.map(url =>
              congDongOnThiService.fetchFileArrayBuffer(url)
            )
            const pdfBuffers = await Promise.all(promises)

            // Merge using pdf-lib
            const mergedPdfBytes = await mergePdfBuffers(pdfBuffers)

            // Trigger browser download
            const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            
            const cleanTitle = activeDoc.title.replace(/[^a-zA-Z0-9-_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ ]/g, '')
            link.download = `${cleanTitle}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)

            // Increment download counter in BE
            await congDongOnThiService.incrementDownload(activeDoc.id)
            message.success('Đã tải tài liệu thành công!')
          } catch (mergeErr) {
            console.error('Error during client-side PDF merge:', mergeErr)
            message.error('Gặp lỗi khi tải tài liệu. Đang tải từng phần riêng lẻ...')
            
            // Fallback: download individual parts
            await congDongOnThiService.incrementDownload(activeDoc.id)
            validUrls.forEach(url => {
              window.open(url, '_blank')
            })
          } finally {
            setIsMerging(false)
          }
        } else {
          // Single file or non-PDF download: download directly
          await congDongOnThiService.incrementDownload(activeDoc.id)
          const url = validUrls[0]
          if (url && url !== '#') {
            window.open(url, '_blank')
          }
        }
      } else {
        message.success(`Bắt đầu tải xuống tài liệu: ${activeDoc.title}`)
      }
    } catch (err) {
      console.error(err)
      message.error('Gặp lỗi khi tải tài liệu.')
    }
  }

  const handleDownloadMd = async () => {
    if (!activeDoc) return
    try {
      // Increment download counter in BE
      await congDongOnThiService.incrementDownload(activeDoc.id)

      if (activeDoc.mdDownloadUrl && activeDoc.mdDownloadUrl !== '#') {
        window.open(activeDoc.mdDownloadUrl, '_blank')
      } else {
        message.error('Không tìm thấy đường dẫn tải file Markdown.')
      }
    } catch (err) {
      console.error(err)
      message.error('Gặp lỗi khi tải tài liệu.')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    message.success('Đã sao chép liên kết tài liệu vào bộ nhớ tạm!')
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isStreaming || !activeDoc) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: chatInput,
    }
    setChatInput('')
    setChatMessages((prev) => [...prev, userMsg])
    setIsStreaming(true)

    // Contextual AI answers based on subject
    let aiResponseText = ''
    const subject = activeDoc.subject
    const q = userMsg.text.toLowerCase()

    if (q.includes('tóm tắt') || q.includes('chương') || q.includes('phần')) {
      if (subject === 'math') {
        aiResponseText = 'Tài liệu Toán học này được chia làm 3 phần chính:\n- Phần I (Trang 1-2): 12 câu hỏi trắc nghiệm khách quan đa dạng chuyên đề (hàm số, mũ, logarit, không gian Oxyz).\n- Phần II (Trang 3): Trắc nghiệm đúng sai chuyên đề hình học và thể tích.\n- Phần III (Trang 4): Câu hỏi trả lời ngắn yêu cầu tính xác suất và tìm cực trị.'
      } else if (subject === 'physics') {
        aiResponseText = 'Cẩm nang Vật lý này tổng hợp 50 công thức giải nhanh cơ bản:\n- Trang 1: Các phương trình dao động điều hòa li độ x, vận tốc v, gia tốc a.\n- Trang 2: Hệ thống công thức con lắc lò xo treo thẳng đứng, độ biến dạng lò xo ở VTCB và lực đàn hồi.\n- Trang 3: Hướng dẫn chi tiết sử dụng máy tính Casio để tổng hợp dao động.'
      } else if (subject === 'chemistry') {
        aiResponseText = 'Tóm tắt lý thuyết Hóa hữu cơ 12 này gồm 2 phần chính:\n- Trang 1: Định nghĩa, phân loại và các phản ứng thủy phân đặc trưng của Este & Lipit.\n- Trang 2: Cấu trúc phân loại Cacbohidrat (Mono-, Di-, Polisaccarit) và tính chất tráng gương.'
      } else if (subject === 'english') {
        aiResponseText = 'Bộ tài liệu Tiếng Anh này gồm 2 phần từ vựng chính:\n- Trang 1: Chủ đề Education & Career với các cụm từ đắt giá như academic performance, core subject, sit an exam.\n- Trang 2: Chủ đề Environment & Technology kèm ví dụ thực tế.'
      } else {
        aiResponseText = 'Tài liệu này hệ thống hóa các kiến thức cơ bản phục vụ ôn thi. Bạn có thể lật các trang bên trái để xem nội dung chi tiết và đặt câu hỏi cụ thể cho tôi.'
      }
    } else if (q.includes('giải') || q.includes('đáp án') || q.includes('câu')) {
      if (subject === 'math') {
        aiResponseText = 'Ở Trang 1:\n- Câu 1: Hàm số nghịch biến trên khoảng cực trị. Từ bảng biến thiên ta xác định cực đại tại x = 3, đáp án đúng là C.\n- Câu 2: Điều kiện x - 2 > 0 <=> x > 2. Vậy tập xác định là (2; +inf) (Đáp án A).\nBạn muốn tôi giải tiếp câu nào?'
      } else if (subject === 'physics') {
        aiResponseText = 'Ở Trang 2, công thức chu kỳ con lắc lò xo treo thẳng đứng: T = 2*pi*√(m/k). Tại VTCB lò xo giãn một lượng D_l = mg/k. Khi tính lực đàn hồi cực tiểu cần lưu ý so sánh độ giãn VTCB D_l với biên độ A.'
      } else if (subject === 'chemistry') {
        aiResponseText = 'Ở Trang 2, Glucozơ tham gia phản ứng tráng gương tạo ra 2 Ag. Phương trình: C6H12O6 + 2AgNO3 + 3NH3 + H2O -> C6H11O7NH4 + 2Ag + 2NH4NO3. Saccarozơ không tráng gương trực tiếp mà phải thủy phân trước tạo ra Glucozơ và Fructozơ.'
      } else if (subject === 'english') {
        aiResponseText = 'Trong Trang 1, collocation "sit an exam" có nghĩa là đi thi. Ví dụ trong đề thi: "Students are required to sit the national graduation exam." Bạn có muốn tôi gợi ý thêm các bài tập trắc nghiệm điền từ không?'
      } else {
        aiResponseText = 'Tôi có thể phân tích và đưa ra hướng dẫn giải chi tiết cho các câu hỏi trong tài liệu. Bạn hãy gõ chính xác số câu hoặc nội dung đề bài nhé!'
      }
    } else {
      aiResponseText = `Tôi đã ghi nhận câu hỏi: "${userMsg.text}". Dựa trên tài liệu "${activeDoc.title}", đây là câu trả lời của tôi: Hệ thống hóa kiến thức và phân tích cấu trúc của các câu hỏi sẽ giúp bạn tối ưu hóa thời gian làm bài. Bạn có cần tôi phân tích sâu hơn phần nào ở trang ${activePage + 1} không?`
    }

    // Start streaming character by character
    const aiMsgId = `ai-${Date.now()}`
    setChatMessages((prev) => [...prev, { id: aiMsgId, sender: 'ai', text: '' }])

    let currentText = ''
    let charIndex = 0
    const timer = setInterval(() => {
      if (charIndex < aiResponseText.length) {
        currentText += aiResponseText[charIndex]
        setChatMessages((prev) =>
          prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: currentText } : msg))
        )
        charIndex++
      } else {
        clearInterval(timer)
        setIsStreaming(false)
      }
    }, 12)
  }

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

  if (isDocLoading) {
    return (
      <CongDongOnThiLayout activeDocId={id || null} onBack={() => navigate('/congdongonthi')} searchValue="" onSearchChange={() => { }}>
        <div className="exam-workspace-loading">
          <div className="exam-workspace-loading__spinner" />
          <p>Đang tải tài liệu chi tiết từ máy chủ...</p>
        </div>
      </CongDongOnThiLayout>
    )
  }

  if (docError || !activeDoc) {
    return (
      <CongDongOnThiLayout activeDocId={id || null} onBack={() => navigate('/congdongonthi')} searchValue="" onSearchChange={() => { }}>
        <div className="exam-workspace-empty">
          <h2>Không tìm thấy tài liệu yêu cầu</h2>
          <p>Tài liệu này không tồn tại hoặc đã bị gỡ bỏ.</p>
          <Button variant="primary" onClick={() => navigate('/congdongonthi')}>
            Quay lại danh sách
          </Button>
        </div>
      </CongDongOnThiLayout>
    )
  }

  const otherDocs = documents.filter((doc) => {
    if (doc.id === activeDoc.id) return false
    const activeDocTags = (activeDoc.tags || []).map((t) => t.trim().toLowerCase())
    const docTags = (doc.tags || []).map((t) => t.trim().toLowerCase())
    return docTags.some((tag) => activeDocTags.includes(tag))
  }).slice(0, 4)

  const totalPages = previewMode === 'md'
    ? (activeDoc.pages?.length || 0)
    : (Array.isArray(activeDoc.downloadUrl) ? activeDoc.downloadUrl.length : 1)

  const showPagination = previewMode === 'md'
    ? (activeDoc.pages && activeDoc.pages.length > 0)
    : (Array.isArray(activeDoc.downloadUrl) && activeDoc.downloadUrl.length > 1)

  return (
    <CongDongOnThiLayout
      activeDocId={activeDoc.id}
      onBack={() => navigate('/congdongonthi')}
      searchValue={detailSearchValue}
      onSearchChange={(val) => {
        setDetailSearchValue(val)
        navigate(`/congdongonthi?search=${encodeURIComponent(val)}`)
      }}
    >
      <div className="exam-workspace">
        {/* LEFT PANEL: READER & METADATA */}
        <div className="exam-workspace__left">
          {/* DOCUMENT HEADER */}
          <div className="exam-doc-header">
            <div className="exam-doc-header__badge-row">
              <span className="exam-doc-header__file-type">
                {getFileIcon(activeDoc.fileType)} {activeDoc.fileType}
              </span>
              <span className="exam-doc-header__size">{activeDoc.fileSize}</span>
            </div>

            <h1 className="exam-doc-header__title">{activeDoc.title}</h1>

            <div className="exam-doc-header__tags">
              {activeDoc.tags?.map((tag) => (
                <span
                  key={tag}
                  className="exam-doc-header__tag"
                  onClick={() => navigate(`/congdongonthi?search=${encodeURIComponent(tag)}`)}
                  style={{ cursor: 'pointer' }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="exam-doc-header__actions-container">
              <div className="exam-doc-header__actions-row">
                <Button
                  variant="primary"
                  icon={isMerging ? <LoadingOutlined /> : <DownloadOutlined />}
                  onClick={handleDownload}
                  className="exam-doc-header__action-btn"
                  disabled={isMerging}
                >
                  <span>Tải file {activeDoc.fileType}</span>
                </Button>
                {activeDoc.mdDownloadUrl && activeDoc.mdDownloadUrl !== '#' && (
                  <Button
                    variant="ghost"
                    icon={<RobotOutlined />}
                    onClick={handleDownloadMd}
                    className="exam-doc-header__action-btn exam-doc-header__action-btn--md"
                  >
                    <span>Tải file MD (Cho AI)</span>
                  </Button>
                )}
              </div>
              <div className="exam-doc-header__actions-row">
                <Button
                  variant="ghost"
                  icon={<RobotOutlined />}
                  onClick={() => setIsChatDrawerOpen(true)}
                  className="exam-doc-header__action-btn exam-doc-header__action-btn--ask"
                >
                  <span>Hỏi chat bot</span>
                </Button>
                <Button
                  variant="ghost"
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                  className="exam-doc-header__action-btn"
                >
                  <span>Chia sẻ</span>
                </Button>
              </div>
            </div>
          </div>

          {/* DOCUMENT PREVIEW */}
          <div className="exam-preview-container">
            <div className="exam-preview-header">
              <h3>Xem trước tài liệu</h3>
              <div className="exam-preview-header__options">
                <button
                  onClick={() => {
                    setPreviewMode('file')
                    setActivePage(0)
                  }}
                  className={`exam-preview-tab-btn ${previewMode === 'file' ? 'exam-preview-tab-btn--active' : ''}`}
                >
                  Xem file {activeDoc.fileType}
                </button>
                {activeDoc.mdDownloadUrl && activeDoc.mdDownloadUrl !== '#' && (
                  <button
                    onClick={() => {
                      setPreviewMode('md')
                      setActivePage(0)
                    }}
                    className={`exam-preview-tab-btn ${previewMode === 'md' ? 'exam-preview-tab-btn--active' : ''}`}
                  >
                    Xem file MD
                  </button>
                )}
              </div>
            </div>
            <div className="exam-preview-content-box">
              {previewMode === 'file' ? (
                <iframe
                  src={
                    Array.isArray(activeDoc.downloadUrl)
                      ? activeDoc.downloadUrl[activePage] || '#'
                      : activeDoc.downloadUrl
                  }
                  title="Document Preview"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              ) : (
                <div ref={mdContainerRef} className="exam-preview-md">
                  {isMdLoading ? (
                    <div className="exam-preview-md__loading">
                      <div className="exam-workspace-loading__spinner" />
                      <p>Đang tải nội dung Markdown...</p>
                    </div>
                  ) : !activeDoc.pages || activeDoc.pages.length === 0 ? (
                    <div className="exam-preview-md__error">
                      <p>Không có nội dung Markdown để xem trước.</p>
                      <Button
                        variant="primary"
                        onClick={handleDownloadMd}
                      >
                        Tải file MD trực tiếp
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="markdown-body"
                      dangerouslySetInnerHTML={{ __html: parsedHtml }}
                    />
                  )}
                </div>
              )}
            </div>
            {showPagination && (
              <div className="exam-preview-footer">
                <button
                  onClick={() => setActivePage((prev) => Math.max(0, prev - 1))}
                  disabled={activePage === 0}
                  className="exam-preview-nav-btn"
                >
                  <LeftCircleOutlined /> Trang trước
                </button>
                <span className="exam-preview-page-indicator">
                  Trang {activePage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setActivePage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={activePage === totalPages - 1}
                  className="exam-preview-nav-btn"
                >
                  Trang sau <RightCircleOutlined />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: CHAT & RELATED */}
        <div className="exam-workspace__right">
          {/* AI CHAT PANEL */}
          <div className="exam-desktop-chat-wrapper">
            {renderChatBot(false)}
          </div>

          {/* RELATED DOCUMENTS */}
          <div className="exam-related-container">
            <div className="exam-related-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Tài liệu khác</h3>
              {activeDoc.tags && activeDoc.tags.length > 0 && (
                <span
                  onClick={() => navigate(`/congdongonthi/search?tags=${encodeURIComponent(activeDoc.tags.join(','))}`)}
                  className="exam-related-view-more"
                  style={{ fontSize: '12px', color: 'var(--exam-primary)', cursor: 'pointer', fontWeight: 500 }}
                >
                  Xem thêm
                </span>
              )}
            </div>
            <div className="exam-related-list">
              {otherDocs.length === 0 ? (
                <p className="exam-related-empty">Không có tài liệu liên quan khác.</p>
              ) : (
                otherDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    isActive={doc.id === activeDoc.id}
                    onClick={() => navigate(`/congdongonthi/${doc.id}`)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE CHAT DRAWER */}
      <Drawer
        open={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        placement="right"
        width="100%"
        closable={false}
        className="exam-chat-drawer-antd"
      >
        <div className="exam-chat-drawer-content">
          <button 
            onClick={() => setIsChatDrawerOpen(false)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: 'var(--exam-text)',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
          {renderChatBot(true)}
        </div>
      </Drawer>
    </CongDongOnThiLayout>
  )
}
