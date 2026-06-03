import { useEffect, useRef, useState } from 'react'
import { InboxOutlined, CloseOutlined } from '@ant-design/icons'
import Modal from '../../../../components/ui/Modal'
import Button from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import type { Project, ProjectFormData } from '../../../../../portfolio/types/Project'

interface ProjectModalProps {
  open: boolean
  editTarget: Project | null
  saving: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => void
}

export function ProjectModal({ open, editTarget, saving, onClose, onSubmit }: ProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [productLink, setProductLink] = useState('')
  const [githubLink, setGithubLink] = useState('')
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync when open or editTarget changes
  useEffect(() => {
    if (open) {
      setName(editTarget?.name ?? '')
      setDescription(editTarget?.description ?? '')
      setProductLink(editTarget?.productLink ?? '')
      setGithubLink(editTarget?.githubLink ?? '')
      setImageFile(null)
      setPreviewUrl(editTarget?.image ?? null)
    }
  }, [open, editTarget])

  // Revoke object URL on unmount/cleanup
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
    if (!name.trim() || !description.trim()) return
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      productLink: productLink.trim() || null,
      githubLink: githubLink.trim() || null,
      image: imageFile || previewUrl // retains old URL if not uploading a new file
    })
  }

  const title = editTarget ? `Chỉnh sửa: ${editTarget.name}` : 'Thêm dự án mới'

  return (
    <Modal open={open} title={title} onCancel={onClose} width={500}>
      <form className="project-modal__form" onSubmit={handleSubmit}>
        
        {/* Name */}
        <div className="project-modal__field">
          <label className="project-modal__label" htmlFor="project-name">
            Tên dự án <span style={{ color: '#f87171' }}>*</span>
          </label>
          <Input
            id="project-name"
            className="project-modal__input"
            placeholder="Ví dụ: E-Commerce WebApp, Portfolio..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
        </div>

        {/* Description */}
        <div className="project-modal__field">
          <label className="project-modal__label" htmlFor="project-desc">
            Mô tả dự án <span style={{ color: '#f87171' }}>*</span>
          </label>
          <Input.TextArea
            id="project-desc"
            className="project-modal__textarea"
            placeholder="Mô tả tóm tắt các tính năng, công nghệ sử dụng..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* GitHub Link */}
        <div className="project-modal__field">
          <label className="project-modal__label" htmlFor="project-github">
            Đường dẫn GitHub (Tùy chọn)
          </label>
          <Input
            id="project-github"
            className="project-modal__input"
            placeholder="https://github.com/username/repo"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </div>

        {/* Demo Product Link */}
        <div className="project-modal__field">
          <label className="project-modal__label" htmlFor="project-product">
            Đường dẫn Sản phẩm / Demo (Tùy chọn)
          </label>
          <Input
            id="project-product"
            className="project-modal__input"
            placeholder="https://myproduct.com"
            value={productLink}
            onChange={(e) => setProductLink(e.target.value)}
          />
        </div>

        {/* Cover Image Upload */}
        <div className="project-modal__field">
          <label className="project-modal__label">Ảnh dự án (Tùy chọn)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div
            className="project-modal__upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="project-modal__preview-wrap">
                <img className="project-modal__preview-img" src={previewUrl} alt="preview" />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  icon={<CloseOutlined />}
                  className="project-modal__remove-img"
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage() }}
                  title="Xóa ảnh"
                />
              </div>
            ) : (
              <div className="project-modal__upload-placeholder">
                <InboxOutlined />
                <span>Nhấn để chọn ảnh bìa</span>
                <span className="project-modal__upload-hint">PNG, JPG, SVG, WEBP</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="project-modal__actions">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            Huỷ
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={saving} disabled={!name.trim() || !description.trim()}>
            {editTarget ? 'Lưu thay đổi' : 'Thêm dự án'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
export default ProjectModal
