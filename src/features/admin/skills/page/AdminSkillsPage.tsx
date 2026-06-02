import { useState } from 'react'
import {
  TrophyOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { useSkillsQuery } from '../../../../hooks/useSkillsQuery'
import { useSkills } from '../hook/useSkills'
import { SkillModal } from '../ui/SkillModal'
import Button from '../../../../components/ui/Button/Button'
import Table from '../../../../components/ui/Table'
import Modal from '../../ui/Modal'
import type { Skill, SkillFormData } from '../../../../types/Skill'

export default function AdminSkillsPage() {
  const {
    skills,
    loading,
    refetch: fetchSkills,
  } = useSkillsQuery()

  const {
    saving,
    deleting,
    error,
    successMsg,
    createSkill,
    updateSkill,
    deleteSkill,
    clearMessages,
  } = useSkills()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Skill | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    clearMessages()
    setModalOpen(true)
  }

  const handleOpenEdit = (skill: Skill) => {
    setEditTarget(skill)
    clearMessages()
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data: SkillFormData) => {
    const success = editTarget
      ? await updateSkill(editTarget.id, data)
      : await createSkill(data)

    if (success) handleClose()
  }

  const handleDelete = (id: string) => {
    setDeleteTargetId(id)
  }

  const columns = [
    {
      title: 'Logo / Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (img: string) => img ? (
        <img
          src={img}
          alt="skill"
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
      ) : (
        <div style={{ fontSize: '20px', color: 'var(--color-text-muted)' }}>
          <TrophyOutlined />
        </div>
      )
    },
    {
      title: 'Tên kỹ năng',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 800 }}>{text}</span>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Skill) => (
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
    <div className="admin-skills-page">
      <div className="admin-skills-page__header">
        <div className="admin-skills-page__header-left">
          <div className="admin-skills-page__icon">
            <TrophyOutlined />
          </div>

          <div>
            <h1 className="admin-skills-page__title">Kỹ năng</h1>
            <p className="admin-skills-page__subtitle">
              Quản lý danh sách kỹ năng hiển thị trên portfolio
            </p>
          </div>
        </div>

        <div className="admin-skills-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => fetchSkills()}
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
            Thêm Skill
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-skills-page__alert admin-skills-page__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-skills-page__alert admin-skills-page__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-skills-page__loading">
          <span className="admin-skills-page__spinner" />
          <span>Đang tải danh sách kỹ năng...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="admin-skills-page__empty">
          <TrophyOutlined />
          <p>Chưa có kỹ năng nào. Hãy thêm kỹ năng đầu tiên!</p>

          <Button
            variant="primary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Skill
          </Button>
        </div>
      ) : (
        <>
          <p className="admin-skills-page__count">{skills.length} kỹ năng</p>

          <Table
            dataSource={skills}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            style={{ marginTop: '20px' }}
          />
        </>
      )}

      <SkillModal
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
                  await deleteSkill(deleteTargetId)
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
          Bạn có chắc chắn muốn xóa kỹ năng này? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  )
}