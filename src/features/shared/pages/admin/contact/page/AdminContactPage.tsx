import { useState } from 'react'
import {
  ContactsOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { useContactQuery } from '../../../../../portfolio/hooks/useContactQuery'
import { useContact } from '../hook/useContact'
import { ContactModal } from '../ui/ContactModal'
import Button from '../../../../components/ui/Button'
import Table from '../../../../components/ui/Table'
import Modal from '../../../../components/ui/Modal'
import type { Contact, ContactFormData } from '../../../../../portfolio/types/Contact'

export default function AdminContactPage() {
  const {
    contacts = [],
    loading,
    refetch: fetchContacts,
  } = useContactQuery()

  const {
    saving,
    deleting,
    error,
    successMsg,
    createContact,
    updateContact,
    deleteContact,
    clearMessages,
  } = useContact()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Contact | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    clearMessages()
    setModalOpen(true)
  }

  const handleOpenEdit = (contact: Contact) => {
    setEditTarget(contact)
    clearMessages()
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data: ContactFormData) => {
    const success = editTarget
      ? await updateContact(editTarget.id, data)
      : await createContact(data)

    if (success) handleClose()
  }

  const handleDelete = (id: string) => {
    setDeleteTargetId(id)
  }

  const columns = [
    {
      title: 'Tên liên hệ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    {
      title: 'Đường dẫn / Liên kết',
      dataIndex: 'link',
      key: 'link',
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
          {text}
        </a>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Contact) => (
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
            loading={deleting === record.id}
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="admin-contact-page">
      <div className="admin-contact-page__header">
        <div className="admin-contact-page__header-left">
          <div className="admin-contact-page__icon">
            <ContactsOutlined />
          </div>

          <div>
            <h1 className="admin-contact-page__title">Liên hệ</h1>
            <p className="admin-contact-page__subtitle">
              Quản lý các mạng xã hội và phương thức liên lạc hiển thị trên portfolio
            </p>
          </div>
        </div>

        <div className="admin-contact-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => fetchContacts()}
            disabled={loading}
          >
            Làm mới
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Liên Hế
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-contact-page__alert admin-contact-page__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-contact-page__alert admin-contact-page__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-contact-page__loading">
          <span className="admin-contact-page__spinner" />
          <span>Đang tải danh sách liên hệ...</span>
        </div>
      ) : contacts.length === 0 ? (
        <div className="admin-contact-page__empty">
          <ContactsOutlined />
          <p>Chưa có phương thức liên hệ nào. Hãy thêm liên hệ đầu tiên!</p>

          <Button
            variant="primary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Liên Hệ
          </Button>
        </div>
      ) : (
        <>
          <p className="admin-contact-page__count">{contacts.length} liên hệ</p>

          <Table
            dataSource={contacts}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            style={{ marginTop: '20px' }}
          />
        </>
      )}

      <ContactModal
        open={modalOpen}
        editTarget={editTarget}
        saving={saving}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      <Modal
        open={!!deleteTargetId}
        title="Xác nhận xóa"
        onCancel={() => setDeleteTargetId(null)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button
              key="cancel"
              variant="secondary"
              onClick={() => setDeleteTargetId(null)}
              disabled={deleting !== null}
            >
              Hủy
            </Button>
            <Button
              key="confirm"
              variant="danger"
              onClick={async () => {
                if (deleteTargetId) {
                  await deleteContact(deleteTargetId)
                  setDeleteTargetId(null)
                }
              }}
              loading={deleting === deleteTargetId}
            >
              Xóa
            </Button>
          </div>
        }
      >
        <p style={{ margin: 0, padding: '16px 0', color: 'var(--color-text)' }}>
          Bạn có chắc chắn muốn xóa liên hệ này? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  )
}
