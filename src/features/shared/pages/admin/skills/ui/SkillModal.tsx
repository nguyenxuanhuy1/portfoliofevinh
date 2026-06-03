import { useEffect, useRef, useState } from 'react'
import { InboxOutlined, CloseOutlined } from '@ant-design/icons'
import Modal from '../../../../components/ui/Modal'
import Button from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import type { Skill } from '../../../../../portfolio/types/Skill'

interface SkillModalProps {
  open: boolean
  editTarget: Skill | null
  saving: boolean
  onClose: () => void
  onSubmit: (data: { name: string; image?: File | null }) => void
}

export function SkillModal({ open, editTarget, saving, onClose, onSubmit }: SkillModalProps) {
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync form khi mở / đổi editTarget
  useEffect(() => {
    if (open) {
      setName(editTarget?.name ?? '')
      setImageFile(null)
      setPreviewUrl(editTarget?.image ?? null)
    }
  }, [open, editTarget])

  // Revoke object URL để tránh memory leak
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), image: imageFile })
  }

  const title = editTarget ? `Chỉnh sửa: ${editTarget.name}` : 'Thêm kỹ năng mới'

  return (
    <Modal open={open} title={title} onCancel={onClose} width={440}>
      <form className="skill-modal__form" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="skill-modal__field">
          <label className="skill-modal__label" htmlFor="skill-name">
            Tên kỹ năng <span style={{ color: '#f87171' }}>*</span>
          </label>
          <Input
            id="skill-name"
            className="skill-modal__input"
            placeholder="Ví dụ: React, TypeScript, Docker..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
        </div>

        {/* Image upload */}
        <div className="skill-modal__field">
          <label className="skill-modal__label">Hình ảnh (tuỳ chọn)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div
            className="skill-modal__upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="skill-modal__preview-wrap">
                <img className="skill-modal__preview-img" src={previewUrl} alt="preview" />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  icon={<CloseOutlined />}
                  className="skill-modal__remove-img"
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage() }}
                  title="Xóa ảnh"
                />
              </div>
            ) : (
              <div className="skill-modal__upload-placeholder">
                <InboxOutlined />
                <span>Nhấn để chọn ảnh</span>
                <span className="skill-modal__upload-hint">PNG, JPG, SVG, WEBP</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="skill-modal__actions">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            Huỷ
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={saving} disabled={!name.trim()}>
            {editTarget ? 'Lưu thay đổi' : 'Thêm kỹ năng'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
