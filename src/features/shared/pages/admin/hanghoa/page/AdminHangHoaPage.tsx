import { useState } from 'react'
import {
  ShoppingOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useGetHangHoaList } from '../../../../../hanghoa/hooks/useHangHoa'
import { useHangHoaAdmin } from '../hook/useHangHoaAdmin'
import { HangHoaModal } from '../ui/HangHoaModal'
import Button from '../../../../components/ui/Button'
import Table from '../../../../components/ui/Table'
import Modal from '../../../../components/ui/Modal'
import type { HangHoa, HangHoaFormData } from '../../../../../hanghoa/types'
import { formatPrice } from '../../../../../hanghoa/utils/formatPrice'

export default function AdminHangHoaPage() {
  const { data: items = [], isLoading, refetch } = useGetHangHoaList()
  const {
    saving,
    deleting,
    error,
    successMsg,
    createHangHoa,
    updateHangHoa,
    deleteHangHoa,
    clearMessages,
  } = useHangHoaAdmin()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<HangHoa | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    clearMessages()
    setModalOpen(true)
  }

  const handleOpenEdit = (item: HangHoa) => {
    setEditTarget(item)
    clearMessages()
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data: HangHoaFormData) => {
    const success = editTarget
      ? await updateHangHoa(editTarget.id, data)
      : await createHangHoa(data)

    if (success) handleClose()
  }

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (img: string | null) =>
        img ? (
          <img
            src={img}
            alt="hanghoa"
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
          />
        ) : (
          <ShoppingOutlined style={{ fontSize: 20, color: 'var(--color-text-muted)' }} />
        ),
    },
    {
      title: 'Loại hàng',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 700 }}>{text}</span>,
    },
    {
      title: 'Loại',
      key: 'type',
      render: (_: unknown, record: HangHoa) =>
        record.isSpecial ? (
          <span style={{ color: '#f26522', fontWeight: 700 }}>Đặc biệt</span>
        ) : (
          'Thường'
        ),
    },
    {
      title: 'Giá',
      key: 'price',
      render: (_: unknown, record: HangHoa) =>
        formatPrice(record.isSpecial ? record.salePrice ?? record.recommendedPrice : record.recommendedPrice),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number, record: HangHoa) => (record.isSpecial ? value : '—'),
    },
    {
      title: 'Sàn TM',
      dataIndex: 'platformImage',
      key: 'platformImage',
      render: (img: string | null, record: HangHoa) =>
        record.isSpecial
          ? 'Web'
          : img ? (
              <img
                src={img}
                alt="platform"
                style={{ width: 36, height: 36, objectFit: 'contain' }}
              />
            ) : (
              '—'
            ),
    },
    {
      title: 'HTML',
      dataIndex: 'htmlContent',
      key: 'htmlContent',
      render: (html: string | null, record: HangHoa) =>
        record.isSpecial ? '—' : html ? 'Có' : '—',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: HangHoa) => (
        <div style={{ display: 'flex', gap: 12 }}>
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
            onClick={() => setDeleteTargetId(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="admin-hanghoa-page">
      <div className="admin-hanghoa-page__header">
        <div className="admin-hanghoa-page__header-left">
          <div className="admin-hanghoa-page__icon">
            <ShoppingOutlined />
          </div>
          <div>
            <h1 className="admin-hanghoa-page__title">Đồ phượt</h1>
            <p className="admin-hanghoa-page__subtitle">
              Quản lý loại hàng, ảnh, giá nên mua và mã HTML nhúng
            </p>
          </div>
        </div>

        <div className="admin-hanghoa-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Làm mới
          </Button>
          <Button variant="primary" size="sm" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Thêm hàng hóa
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-hanghoa-page__alert admin-hanghoa-page__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-hanghoa-page__alert admin-hanghoa-page__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="admin-hanghoa-page__loading">
          <span className="admin-hanghoa-page__spinner" />
          <span>Đang tải danh sách hàng hóa...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="admin-hanghoa-page__empty">
          <ShoppingOutlined />
          <p>Chưa có hàng hóa nào. Hãy thêm sản phẩm đầu tiên!</p>
          <Button variant="primary" size="md" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Thêm hàng hóa
          </Button>
        </div>
      ) : (
        <>
          <p className="admin-hanghoa-page__count">{items.length} hàng hóa</p>
          <Table
            dataSource={items}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            style={{ marginTop: 20 }}
          />
        </>
      )}

      <HangHoaModal
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button
              variant="secondary"
              onClick={() => setDeleteTargetId(null)}
              disabled={deleting !== null}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              loading={deleting === deleteTargetId}
              onClick={async () => {
                if (deleteTargetId) {
                  await deleteHangHoa(deleteTargetId)
                  setDeleteTargetId(null)
                }
              }}
            >
              Xóa
            </Button>
          </div>
        }
      >
        <p style={{ margin: 0, padding: '16px 0', color: 'var(--color-text)' }}>
          Bạn có chắc chắn muốn xóa hàng hóa này? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  )
}
