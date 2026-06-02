import { useState } from 'react'
import {
  AppstoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { useProjectQuery } from '../../../../hooks/useProjectQuery'
import { useProject } from '../hook/useProject'
import { ProjectModal } from '../ui/ProjectModal'
import Button from '../../../../components/ui/Button/Button'
import Table from '../../../../components/ui/Table'
import Modal from '../../ui/Modal'
import type { Project, ProjectFormData } from '../../../../types/Project'

export default function AdminProjectPage() {
  const {
    projects,
    loading,
    refetch: fetchProjects,
  } = useProjectQuery()

  const {
    saving,
    deleting,
    error,
    successMsg,
    createProject,
    updateProject,
    deleteProject,
    clearMessages,
  } = useProject()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Project | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    clearMessages()
    setModalOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setEditTarget(project)
    clearMessages()
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data: ProjectFormData) => {
    const success = editTarget
      ? await updateProject(editTarget.id, data)
      : await createProject(data)

    if (success) handleClose()
  }

  const handleDelete = (id: string) => {
    setDeleteTargetId(id)
  }

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (url: string) => url ? (
        <img
          src={url}
          alt="project"
          style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
        />
      ) : (
        <div
          style={{ width: '60px', height: '40px', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}
        >
          <AppstoreOutlined />
        </div>
      )
    },
    {
      title: 'Tên dự án',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 800 }}>{text}</span>
    },
    {
      title: 'Mô tả ngắn',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>{text}</span>
    },
    {
      title: 'Liên kết',
      key: 'links',
      render: (_: any, record: Project) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
          {record.productLink && (
            <a href={record.productLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
              Demo
            </a>
          )}
          {record.githubLink && (
            <a href={record.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)' }}>
              Code
            </a>
          )}
        </div>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Project) => (
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
    <div className="admin-project-page">
      <div className="admin-project-page__header">
        <div className="admin-project-page__header-left">
          <div className="admin-project-page__icon">
            <AppstoreOutlined />
          </div>

          <div>
            <h1 className="admin-project-page__title">Dự án</h1>
            <p className="admin-project-page__subtitle">
              Quản lý danh sách sản phẩm, dự án cá nhân hiển thị trên portfolio
            </p>
          </div>
        </div>

        <div className="admin-project-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => fetchProjects()}
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
            Thêm Dự án
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-project-page__alert admin-project-page__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-project-page__alert admin-project-page__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-project-page__loading">
          <span className="admin-project-page__spinner" />
          <span>Đang tải danh sách dự án...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="admin-project-page__empty">
          <AppstoreOutlined />
          <p>Chưa có dự án nào. Hãy thêm dự án đầu tiên của bạn!</p>

          <Button
            variant="primary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Dự án
          </Button>
        </div>
      ) : (
        <>
          <p className="admin-project-page__count">{projects.length} dự án</p>

          <Table
            dataSource={projects}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            style={{ marginTop: '20px' }}
          />
        </>
      )}

      <ProjectModal
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
                  await deleteProject(deleteTargetId)
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
          Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  )
}
