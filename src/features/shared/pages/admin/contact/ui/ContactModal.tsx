import { useState, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import Modal from '../../../../components/ui/Modal'
import Button from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import type { Contact, ContactFormData } from '../../../../../portfolio/types/Contact'

interface ContactModalProps {
  open: boolean
  editTarget: Contact | null
  saving: boolean
  onClose: () => void
  onSubmit: (data: ContactFormData) => void
}

export function ContactModal({ open, editTarget, saving, onClose, onSubmit }: ContactModalProps) {
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (editTarget) {
      setName(editTarget.name)
      setLink(editTarget.link)
    } else {
      setName('')
      setLink('')
    }
    setValidationError(null)
  }, [editTarget, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedLink = link.trim()

    if (!trimmedName || !trimmedLink) {
      setValidationError('Vui lòng điền đầy đủ tất cả các trường.')
      return
    }

    setValidationError(null)
    onSubmit({
      name: trimmedName,
      link: trimmedLink,
    })
  }

  const title = editTarget ? 'Chỉnh sửa Liên hệ' : 'Thêm Liên hệ mới'

  return (
    <Modal open={open} title={title} onCancel={onClose} width={440}>
      <form className="contact-modal__form" onSubmit={handleSubmit}>
        {validationError && (
          <div className="contact-modal__error-alert">
            {validationError}
          </div>
        )}

        <div className="contact-modal__field">
          <label className="contact-modal__label" htmlFor="contact-name">
            Tên Liên hệ
          </label>
          <Input
            className="contact-modal__input"
            id="contact-name"
            type="text"
            placeholder="Ví dụ: GitHub, Facebook, Email..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />
        </div>

        <div className="contact-modal__field">
          <label className="contact-modal__label" htmlFor="contact-link">
            Đường dẫn / Liên kết
          </label>
          <Input
            className="contact-modal__input"
            id="contact-link"
            type="text"
            placeholder="Ví dụ: https://github.com/username hoặc mailto:email@example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={saving}
          />
        </div>

        <div className="contact-modal__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            icon={saving ? <LoadingOutlined /> : undefined}
          >
            Lưu
          </Button>
        </div>
      </form>
    </Modal>
  )
}
