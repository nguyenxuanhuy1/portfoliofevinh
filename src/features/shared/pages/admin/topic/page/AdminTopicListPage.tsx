import { useState } from 'react'
import {
  BookOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import Table from '../../../../components/ui/Table'
import Modal from '../../../../components/ui/Modal'

import { useLearnTopicsQuery } from '../../../../../learnEnglish/hooks/useLearnTopicQuery'
import learnTopicService from '../service/learnTopicService'
import { AdminTopicModal } from '../ui/AdminTopicModal'
import Button from '../../../../components/ui/Button'
import type { LearnTopic } from '../../../../../learnEnglish/types/LearnEnglish'

export default function AdminTopicListPage() {
  const { topics = [], loading, refetch } = useLearnTopicsQuery()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<LearnTopic | null>(null)

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    setError(null)
    setSuccessMsg(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (topic: LearnTopic) => {
    setEditTarget(topic)
    setError(null)
    setSuccessMsg(null)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (name: string, data: any): Promise<boolean> => {
    setSaving(true)
    setError(null)
    setSuccessMsg(null)

    try {
      if (editTarget) {
        await learnTopicService.update(editTarget.id, { name, data })
        setSuccessMsg('Cập nhật chủ đề học tiếng Anh thành công!')
      } else {
        await learnTopicService.create({ name, data })
        setSuccessMsg('Tạo chủ đề học tiếng Anh mới thành công!')
      }
      refetch()
      return true
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'Có lỗi xảy ra khi lưu chủ đề.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError(null)
    setSuccessMsg(null)

    try {
      await learnTopicService.delete(id)
      setSuccessMsg('Xóa chủ đề học tiếng Anh thành công!')
      refetch()
    } catch (err: any) {
      console.error('Delete error:', err)
      setError(err.message || 'Có lỗi xảy ra khi xóa chủ đề.')
    } finally {
      setDeletingId(null)
    }
  }

  const columns = [
    {
      title: 'Tên chủ đề',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 800 }}>{text}</span>
    },
    {
      title: 'Chủ đề trong JSON',
      dataIndex: ['data', 'topic'],
      key: 'jsonTopic',
    },
    {
      title: 'Bài đọc mẫu',
      dataIndex: ['data', 'reading_passage', 'title'],
      key: 'readingTitle',
    },
    {
      title: 'Số từ mới',
      dataIndex: ['data', 'vocabulary'],
      key: 'vocabCount',
      render: (vocab: any[]) => vocab?.length || 0
    },
    {
      title: 'Số bài tập',
      dataIndex: ['data', 'exercises'],
      key: 'exerciseCount',
      render: (exs: any[]) => exs?.length || 0
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: LearnTopic) => (
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
      )
    }
  ]

  return (
    <div className="admin-contact-page">
      <div className="admin-contact-page__header">
        <div className="admin-contact-page__header-left">
          <div className="admin-contact-page__icon" style={{ background: 'rgba(129, 140, 248, 0.15)', color: 'var(--color-primary)' }}>
            <BookOutlined />
          </div>

          <div>
            <h1 className="admin-contact-page__title">Học Tiếng Anh (Topics)</h1>
            <p className="admin-contact-page__subtitle">
              Quản lý danh sách các chủ đề từ vựng, bài tập luyện tập tiếng Anh trên portfolio
            </p>
          </div>
        </div>

        <div className="admin-contact-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
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
            Thêm Chủ Đề
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

      <Table
        dataSource={topics}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        style={{ marginTop: '20px' }}
      />

      <AdminTopicModal
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
              disabled={deletingId !== null}
            >
              Hủy
            </Button>
            <Button
              key="confirm"
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
          Bạn có chắc chắn muốn xóa chủ đề học tiếng Anh này không? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  )
}
