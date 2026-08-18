import { useEffect, useRef, useState } from 'react'
import { InboxOutlined, CloseOutlined } from '@ant-design/icons'
import Modal from '../../../../components/ui/Modal'
import Button from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import type { HangHoa, HangHoaFormData } from '../../../../../hanghoa/types'

interface HangHoaModalProps {
  open: boolean
  editTarget: HangHoa | null
  saving: boolean
  onClose: () => void
  onSubmit: (data: HangHoaFormData) => void
}

export function HangHoaModal({ open, editTarget, saving, onClose, onSubmit }: HangHoaModalProps) {
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [recommendedPrice, setRecommendedPrice] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [productLink, setProductLink] = useState('')
  const [isSpecial, setIsSpecial] = useState(false)
  const [salePrice, setSalePrice] = useState('')
  const [quantity, setQuantity] = useState('0')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [platformImageFile, setPlatformImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [platformPreview, setPlatformPreview] = useState<string | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const platformInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setCategory(editTarget?.category ?? '')
    setName(editTarget?.name ?? '')
    setRecommendedPrice(editTarget ? String(editTarget.recommendedPrice ?? '') : '')
    setHtmlContent(editTarget?.htmlContent ?? '')
    setProductLink(editTarget?.productLink ?? '')
    setIsSpecial(Boolean(editTarget?.isSpecial))
    setSalePrice(editTarget?.salePrice != null ? String(editTarget.salePrice) : '')
    setQuantity(editTarget ? String(editTarget.quantity ?? 0) : '0')
    setImageFile(null)
    setPlatformImageFile(null)
    setImagePreview(editTarget?.image ?? null)
    setPlatformPreview(editTarget?.platformImage ?? null)
  }, [open, editTarget])

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
      if (platformPreview?.startsWith('blob:')) URL.revokeObjectURL(platformPreview)
    }
  }, [imagePreview, platformPreview])

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: 'image' | 'platform'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    if (kind === 'image') {
      setImageFile(file)
      setImagePreview(url)
    } else {
      setPlatformImageFile(file)
      setPlatformPreview(url)
    }
  }

  const handleRemoveImage = (kind: 'image' | 'platform') => {
    if (kind === 'image') {
      setImageFile(null)
      setImagePreview(null)
      if (imageInputRef.current) imageInputRef.current.value = ''
    } else {
      setPlatformImageFile(null)
      setPlatformPreview(null)
      if (platformInputRef.current) platformInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category.trim() || !name.trim()) return
    if (isSpecial) {
      if (salePrice === '' || quantity === '') return
    } else if (recommendedPrice === '') {
      return
    }

    const sale = Number(salePrice)

    onSubmit({
      category: category.trim(),
      name: name.trim(),
      recommendedPrice: isSpecial ? sale : Number(recommendedPrice),
      htmlContent: isSpecial ? null : htmlContent.trim() || null,
      productLink: isSpecial ? null : productLink.trim() || null,
      image: imageFile,
      platformImage: isSpecial ? null : platformImageFile,
      isSpecial,
      salePrice: isSpecial ? sale : null,
      quantity: isSpecial ? Number(quantity) : 0,
    })
  }

  const title = editTarget ? `Chỉnh sửa: ${editTarget.name}` : 'Thêm hàng hóa mới'
  const canSubmit = isSpecial
    ? Boolean(category.trim() && name.trim() && salePrice !== '' && quantity !== '')
    : Boolean(category.trim() && name.trim() && recommendedPrice !== '')

  const renderUpload = (
    kind: 'image' | 'platform',
    label: string,
    preview: string | null,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => (
    <div className="hanghoa-modal__field">
      <label className="hanghoa-modal__label">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleImageChange(e, kind)}
      />
      <div className="hanghoa-modal__upload-area" onClick={() => inputRef.current?.click()}>
        {preview ? (
          <div className="hanghoa-modal__preview-wrap">
            <img className="hanghoa-modal__preview-img" src={preview} alt="preview" />
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={<CloseOutlined />}
              className="hanghoa-modal__remove-img"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage(kind)
              }}
              title="Xóa ảnh"
            />
          </div>
        ) : (
          <div className="hanghoa-modal__upload-placeholder">
            <InboxOutlined />
            <span>Nhấn để chọn ảnh</span>
            <span className="hanghoa-modal__upload-hint">PNG, JPG, WEBP</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Modal open={open} title={title} onCancel={onClose} width={560}>
      <form className="hanghoa-modal__form" onSubmit={handleSubmit}>
        <div className="hanghoa-modal__field">
          <label className="hanghoa-modal__check">
            <input
              type="checkbox"
              checked={isSpecial}
              onChange={(e) => setIsSpecial(e.target.checked)}
            />
            <span>Sản phẩm đặc biệt (bán tại web)</span>
          </label>
        </div>

        <div className="hanghoa-modal__field">
          <label className="hanghoa-modal__label" htmlFor="hanghoa-category">
            Loại hàng <span className="hanghoa-modal__required">*</span>
          </label>
          <Input
            id="hanghoa-category"
            className="hanghoa-modal__input"
            placeholder="Ví dụ: Điện thoại, Laptop..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div className="hanghoa-modal__field">
          <label className="hanghoa-modal__label" htmlFor="hanghoa-name">
            Tên hàng <span className="hanghoa-modal__required">*</span>
          </label>
          <Input
            id="hanghoa-name"
            className="hanghoa-modal__input"
            placeholder="Tên sản phẩm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {isSpecial ? (
          <>
            <div className="hanghoa-modal__field">
              <label className="hanghoa-modal__label" htmlFor="hanghoa-sale-price">
                Giá bán <span className="hanghoa-modal__required">*</span>
              </label>
              <Input
                id="hanghoa-sale-price"
                className="hanghoa-modal__input"
                type="number"
                min="0"
                step="1000"
                placeholder="Ví dụ: 15000000"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                required
              />
            </div>

            <div className="hanghoa-modal__field">
              <label className="hanghoa-modal__label" htmlFor="hanghoa-quantity">
                Số lượng <span className="hanghoa-modal__required">*</span>
              </label>
              <Input
                id="hanghoa-quantity"
                className="hanghoa-modal__input"
                type="number"
                min="0"
                step="1"
                placeholder="Ví dụ: 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <div className="hanghoa-modal__field">
            <label className="hanghoa-modal__label" htmlFor="hanghoa-price">
              Giá nên mua <span className="hanghoa-modal__required">*</span>
            </label>
            <Input
              id="hanghoa-price"
              className="hanghoa-modal__input"
              type="number"
              min="0"
              step="1000"
              placeholder="Ví dụ: 15000000"
              value={recommendedPrice}
              onChange={(e) => setRecommendedPrice(e.target.value)}
              required
            />
          </div>
        )}

        {renderUpload('image', 'Ảnh sản phẩm', imagePreview, imageInputRef)}

        {!isSpecial && (
          <>
            <div className="hanghoa-modal__field">
              <label className="hanghoa-modal__label" htmlFor="hanghoa-link">
                Link nơi bán
              </label>
              <Input.TextArea
                id="hanghoa-link"
                className="hanghoa-modal__textarea"
                rows={3}
                maxLength={10000}
                placeholder="https://..."
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
              />
            </div>

            {renderUpload('platform', 'Ảnh sàn thương mại', platformPreview, platformInputRef)}

            <div className="hanghoa-modal__field">
              <label className="hanghoa-modal__label" htmlFor="hanghoa-html">
                Đoạn mã HTML (FE sẽ render)
              </label>
              <Input.TextArea
                id="hanghoa-html"
                className="hanghoa-modal__textarea"
                rows={6}
                placeholder="<div>...</div> hoặc mã nhúng affiliate"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="hanghoa-modal__actions">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            Huỷ
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={saving}
            disabled={!canSubmit}
          >
            {editTarget ? 'Lưu thay đổi' : 'Thêm hàng hóa'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
