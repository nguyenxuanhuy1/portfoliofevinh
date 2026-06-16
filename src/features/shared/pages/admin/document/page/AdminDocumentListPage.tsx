import { useState, useMemo, useEffect } from 'react'
import {
  FileTextOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Form, Select, Checkbox, message } from 'antd'
import { useQueryClient } from '@tanstack/react-query'

import Table from '../../../../components/ui/Table'
import Modal from '../../../../components/ui/Modal'
import Button from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'

import { useGetDocuments, EXAM_DOCUMENTS_QUERY_KEY } from '../../../../../congdongonthi/hooks/useExamDocuments'
import examDocumentService from '../service/examDocumentService'
import type { ExamDocument } from '../../../../../congdongonthi/types'

export default function AdminDocumentListPage() {
  const queryClient = useQueryClient()
  const { data: documents = [], isLoading, refetch } = useGetDocuments()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ExamDocument | null>(null)
  
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Upload/Form states
  const [file, setFile] = useState<File | null>(null)
  const [form] = Form.useForm()

  // Auto clear alerts after 5 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMsg])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 7000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleOpenCreate = () => {
    setEditTarget(null)
    setFile(null)
    setError(null)
    setSuccessMsg(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleOpenEdit = (doc: ExamDocument) => {
    setEditTarget(doc)
    setFile(null)
    setError(null)
    setSuccessMsg(null)
    form.setFieldsValue({
      title: doc.title,
      description: doc.description,
      subject: doc.subject,
      tags: doc.tags,
      level: doc.level === 1,
    })
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
    setFile(null)
    form.resetFields()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Auto fill title if empty
      const currentTitle = form.getFieldValue('title')
      if (!currentTitle) {
        const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name
        form.setFieldValue('title', baseName)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)
      setError(null)
      setSuccessMsg(null)

      const metadata = {
        title: values.title,
        description: values.description || '',
        subject: values.subject,
        tags: values.tags || [],
        level: values.level ? 1 : 0,
      }

      if (editTarget) {
        await examDocumentService.update(editTarget.id, metadata)
        setSuccessMsg(`Cập nhật tài liệu "${values.title}" thành công!`)
        message.success('Cập nhật tài liệu thành công!')
      } else {
        if (!file) {
          setError('Vui lòng chọn file tài liệu cần tải lên!')
          setSaving(false)
          return
        }
        await examDocumentService.upload(file, metadata)
        setSuccessMsg('Đã thêm tài liệu mới thành công! Hệ thống đang xử lý file ở chế độ nền.')
        message.success('Tải lên tài liệu thành công!')
      }

      queryClient.invalidateQueries({ queryKey: EXAM_DOCUMENTS_QUERY_KEY })
      handleClose()
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi lưu tài liệu.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError(null)
    setSuccessMsg(null)

    try {
      await examDocumentService.delete(id)
      setSuccessMsg('Xóa tài liệu và file đính kèm thành công!')
      message.success('Xóa tài liệu thành công!')
      queryClient.invalidateQueries({ queryKey: EXAM_DOCUMENTS_QUERY_KEY })
    } catch (err: any) {
      console.error('Delete error:', err)
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa tài liệu.')
    } finally {
      setDeletingId(null)
    }
  }

  const columns = useMemo(() => [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
      width: '35%',
      render: (text: string) => (
        <span 
          style={{ 
            fontWeight: 800,
            display: 'block',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }} 
          title={text}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
      width: '12%',
      render: (subject: string) => <span className="exam-tag-pill">{subject}</span>,
    },
    {
      title: 'Type',
      key: 'fileInfo',
      width: '18%',
      render: (_: any, record: ExamDocument) => (
        <span>{record.fileType} ({record.fileSize})</span>
      ),
    },
    {
      title: 'Thống kê',
      key: 'stats',
      width: '15%',
      render: (_: any, record: ExamDocument) => (
        <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.45)' }}>
          {record.views} xem / {record.downloads} tải
        </span>
      ),
    },
    {
      title: 'Hot/Spotlight',
      dataIndex: 'level',
      key: 'level',
      width: '10%',
      render: (level?: number) => level === 1 ? (
        <span style={{ color: '#ef4444', fontWeight: 600 }}>HOT</span>
      ) : (
        <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>Thường</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      render: (_: any, record: ExamDocument) => (
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          >
            Sửa
          </Button>

          <Button
            variant="danger"
            size="sm"
            loading={deletingId === record.id}
            icon={<DeleteOutlined />}
            onClick={() => setDeleteTargetId(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    }
  ], [deletingId])

  return (
    <div className="admin-document-page">
      <div className="admin-document-page__header">
        <div className="admin-document-page__header-left">
          <div className="admin-document-page__icon" style={{ background: 'rgba(0, 138, 187, 0.15)', color: '#008abb' }}>
            <FileTextOutlined />
          </div>

          <div>
            <h1 className="admin-document-page__title">Cộng Đồng Ôn Thi</h1>
            <p className="admin-document-page__subtitle">
              Quản lý danh sách tài liệu học tập, đề thi trắc nghiệm, bài tập tự luận và file PDF/DOCX
            </p>
          </div>
        </div>

        <div className="admin-document-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Làm mới
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm tài liệu
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-document-page__alert admin-document-page__alert--success" style={{ marginBottom: '16px' }}>
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-document-page__alert admin-document-page__alert--error" style={{ marginBottom: '16px' }}>
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      <Table
        dataSource={documents}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 8 }}
        style={{ marginTop: '10px' }}
      />

      {/* Form Modal (Create/Edit) */}
      <Modal
        open={modalOpen}
        title={editTarget ? `Sửa thông tin: ${editTarget.title}` : 'Thêm tài liệu ôn thi mới'}
        onCancel={handleClose}
        width={540}
        className="admin-document-modal"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={saving}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSubmit}>
              {editTarget ? 'Lưu thay đổi' : 'Tải lên tài liệu'}
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 0' }}
        >
          <Form.Item
            name="title"
            label="Tên tài liệu"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu!' }]}
          >
            <Input placeholder="Ví dụ: Đề thi thử đại học môn Toán lần 1..." />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            <Input placeholder="Ví dụ: math, physics, chemistry..." />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Thẻ (Nhập và nhấn Enter để thêm)"
          >
            <Select
              mode="tags"
              placeholder="Nhập thẻ..."
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả tài liệu"
          >
            <Input.TextArea
              placeholder="Nhập mô tả tóm tắt nội dung tài liệu..."
              rows={4}
            />
          </Form.Item>

          {/* File Upload (Only for Create) */}
          {!editTarget && (
            <Form.Item label="File đính kèm (PDF, DOCX, ZIP...)" required>
              <div 
                className="admin-document-upload-zone"
                onClick={() => document.getElementById('document-file-input')?.click()}
              >
                <input
                  type="file"
                  id="document-file-input"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <UploadOutlined className="admin-document-upload-zone__icon" />
                <div className="admin-document-upload-zone__text">
                  {file ? 'Nhấn để chọn file khác' : 'Nhấp vào đây để tải tài liệu lên'}
                </div>
                <div className="admin-document-upload-zone__hint">
                  Hỗ trợ định dạng PDF, DOCX, ZIP... Dung lượng tối đa 50MB
                </div>
                {file && (
                  <div className="admin-document-upload-zone__file" onClick={(e) => e.stopPropagation()}>
                    File đã chọn: <strong>{file.name}</strong> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </Form.Item>
          )}

          <Form.Item name="level" valuePropName="checked">
            <Checkbox style={{ color: '#ffffff' }}>Đánh dấu là tài liệu HOT / Nổi bật</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTargetId}
        title="Xác nhận xóa tài liệu"
        onCancel={() => setDeleteTargetId(null)}
        className="admin-document-modal"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="secondary" onClick={() => setDeleteTargetId(null)} disabled={deletingId !== null}>
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (deleteTargetId) {
                  await handleDelete(deleteTargetId)
                  setDeleteTargetId(null)
                }
              }}
              loading={deletingId !== null}
            >
              Xóa
            </Button>
          </div>
        }
      >
        <p style={{ margin: 0, padding: '16px 0', color: 'var(--color-text)' }}>
          Bạn có chắc chắn muốn xóa tài liệu này không? File đính kèm trên Cloudinary cũng sẽ bị xóa. Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  )
}
