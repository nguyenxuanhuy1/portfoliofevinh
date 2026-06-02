import { useEffect, useState } from 'react'
import Modal from '../../ui/Modal'
import Button from '../../../../components/ui/Button/Button'
import Input from '../../../../components/ui/Input'
import type { Experience, ExperienceFormData } from '../../../../types/Experience'

interface ExperienceModalProps {
  open: boolean
  editTarget: Experience | null
  saving: boolean
  onClose: () => void
  onSubmit: (data: ExperienceFormData) => void
}

export function ExperienceModal({
  open,
  editTarget,
  saving,
  onClose,
  onSubmit,
}: ExperienceModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isCurrent, setIsCurrent] = useState(false)

  // Đồng bộ form khi mở modal hoặc thay đổi mục tiêu chỉnh sửa
  useEffect(() => {
    if (open) {
      setName(editTarget?.name ?? '')
      setDescription(editTarget?.description ?? '')
      setStartDate(editTarget?.startDate ?? '')

      const hasEndDate = !!editTarget?.endDate && editTarget.endDate.trim() !== ''
      setEndDate(hasEndDate ? editTarget!.endDate! : '')
      setIsCurrent(!hasEndDate && !!editTarget) // Nếu đang sửa và không có endDate => Đang làm việc tại đây
    }
  }, [open, editTarget])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim() || !startDate.trim()) return

    const data: ExperienceFormData = {
      name: name.trim(),
      description: description.trim(),
      startDate: startDate.trim(),
      endDate: isCurrent ? null : endDate.trim() || null,
    }

    onSubmit(data)
  }

  const title = editTarget ? `Chỉnh sửa: ${editTarget.name}` : 'Thêm kinh nghiệm mới'

  return (
    <Modal open={open} title={title} onCancel={onClose} width={480}>
      <form className="experience-modal__form" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="experience-modal__field">
          <label className="experience-modal__label" htmlFor="exp-name">
            Tên kinh nghiệm / Công việc <span style={{ color: '#f87171' }}>*</span>
          </label>
          <Input
            id="exp-name"
            className="experience-modal__input"
            placeholder="Ví dụ: Senior Frontend Developer tại Google"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
            disabled={saving}
          />
        </div>

        {/* Start Date & End Date */}
        <div className="experience-modal__row">
          <div className="experience-modal__field" style={{ flex: 1 }}>
            <label className="experience-modal__label" htmlFor="exp-start-date">
              Ngày bắt đầu <span style={{ color: '#f87171' }}>*</span>
            </label>
            <Input
              id="exp-start-date"
              className="experience-modal__input"
              placeholder="Ví dụ: 09/2022"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="experience-modal__field" style={{ flex: 1 }}>
            <label className="experience-modal__label" htmlFor="exp-end-date">
              Ngày kết thúc
            </label>
            <Input
              id="exp-end-date"
              className="experience-modal__input"
              placeholder="Ví dụ: 12/2024"
              value={isCurrent ? '' : endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isCurrent || saving}
            />
          </div>
        </div>

        {/* Checkbox Current */}
        <div className="experience-modal__checkbox-field">
          <input
            type="checkbox"
            id="exp-is-current"
            className="experience-modal__checkbox"
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
            disabled={saving}
          />
          <label className="experience-modal__checkbox-label" htmlFor="exp-is-current">
            Tôi đang làm việc tại đây (Hiện tại)
          </label>
        </div>

        {/* Description */}
        <div className="experience-modal__field">
          <label className="experience-modal__label" htmlFor="exp-description">
            Mô tả công việc / Dự án <span style={{ color: '#f87171' }}>*</span>
          </label>
          <Input.TextArea
            id="exp-description"
            className="experience-modal__textarea"
            placeholder="Mô tả chi tiết những gì bạn đã làm, công nghệ sử dụng..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={saving}
          />
        </div>

        {/* Footer actions */}
        <div className="experience-modal__actions">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={saving}
          >
            Huỷ
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={saving}
            disabled={!name.trim() || !description.trim() || !startDate.trim()}
          >
            {editTarget ? 'Lưu thay đổi' : 'Thêm kinh nghiệm'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
