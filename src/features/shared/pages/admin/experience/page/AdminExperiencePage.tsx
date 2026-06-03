import { useState } from 'react'
import {
  CalendarOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { useExperienceQuery } from '../../../../../portfolio/hooks/useExperienceQuery'
import { useExperience } from '../hook/useExperience'
import { ExperienceModal } from '../ui/ExperienceModal'
import Button from '../../../../components/ui/Button'
import Table from '../../../../components/ui/Table'
import Modal from '../../../../components/ui/Modal'
import type { Experience, ExperienceFormData } from '../../../../../portfolio/types/Experience'

export default function AdminExperiencePage() {
  const {
    experiences,
    loading,
    refetch: fetchExperiences,
  } = useExperienceQuery()

  const {
    saving,
    deleting,
    error,
    successMsg,
    createExperience,
    updateExperience,
    deleteExperience,
    clearMessages,
  } = useExperience()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Experience | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    clearMessages()
    setModalOpen(true)
  }

  const handleOpenEdit = (exp: Experience) => {
    setEditTarget(exp)
    clearMessages()
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data: ExperienceFormData) => {
    const success = editTarget
      ? await updateExperience(editTarget.id, data)
      : await createExperience(data)

    if (success) handleClose()
  }

  const handleDelete = (id: string) => {
    setDeleteTargetId(id)
  }

  const columns = [
    {
      title: 'Công việc / Kinh nghiệm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 800 }}>{text}</span>
    },
    {
      title: 'Thời gian',
      key: 'dates',
      render: (_: any, record: Experience) => (
        <span>
          {record.startDate} — {record.endDate || 'Hiện tại'}
        </span>
      )
    },
    {
      title: 'Mô tả chi tiết',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>{text}</span>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Experience) => (
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
    <div className="admin-experience-page">
      <div className="admin-experience-page__header">
        <div className="admin-experience-page__header-left">
          <div className="admin-experience-page__icon">
            <CalendarOutlined />
          </div>

          <div>
            <h1 className="admin-experience-page__title">Kinh nghiệm</h1>
            <p className="admin-experience-page__subtitle">
              Quản lý lịch sử và kinh nghiệm làm việc hiển thị trên portfolio
            </p>
          </div>
        </div>

        <div className="admin-experience-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => fetchExperiences()}
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
            Thêm Kinh Nghiệm
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-experience-page__alert admin-experience-page__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-experience-page__alert admin-experience-page__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-experience-page__loading">
          <span className="admin-experience-page__spinner" />
          <span>Đang tải danh sách kinh nghiệm...</span>
        </div>
      ) : experiences.length === 0 ? (
        <div className="admin-experience-page__empty">
          <CalendarOutlined />
          <p>Chưa có kinh nghiệm làm việc nào. Hãy thêm kinh nghiệm đầu tiên!</p>

          <Button
            variant="primary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Kinh Nghiệm
          </Button>
        </div>
      ) : (
        <>
          <p className="admin-experience-page__count">{experiences.length} kinh nghiệm</p>

          <Table
            dataSource={experiences}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            style={{ marginTop: '20px' }}
          />
        </>
      )}

      <ExperienceModal
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
                  await deleteExperience(deleteTargetId)
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
          Bạn có chắc chắn muốn xóa kinh nghiệm này? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  )
}
