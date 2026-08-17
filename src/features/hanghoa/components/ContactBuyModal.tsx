import { useEffect } from 'react'
import {
  CloseOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  GithubOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { useContactQuery } from '../../portfolio/hooks/useContactQuery'
import { formatPrice } from '../utils/formatPrice'
import type { HangHoa } from '../types'

interface ContactBuyModalProps {
  open: boolean
  item: HangHoa
  onClose: () => void
}

function getContactIcon(name: string) {
  const lower = name.toLowerCase()
  if (
    lower.includes('phone') ||
    lower.includes('tel') ||
    lower.includes('zalo') ||
    lower.includes('sđt') ||
    lower.includes('hotline')
  ) {
    return <PhoneOutlined />
  }
  if (lower.includes('email') || lower.includes('mail') || lower.includes('gmail')) {
    return <MailOutlined />
  }
  if (lower.includes('github')) return <GithubOutlined />
  if (lower.includes('facebook') || lower.includes('fb')) return <FacebookOutlined />
  if (lower.includes('linkedin')) return <LinkedinOutlined />
  return <LinkOutlined />
}

export default function ContactBuyModal({ open, item, onClose }: ContactBuyModalProps) {
  const { contacts, loading } = useContactQuery()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const price = item.salePrice ?? item.recommendedPrice

  return (
    <div className="hanghoa-modal-overlay" onClick={onClose}>
      <div
        className="hanghoa-buy-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Liên hệ mua hàng"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="hanghoa-buy-modal__close"
          onClick={onClose}
          aria-label="Đóng"
        >
          <CloseOutlined />
        </button>

        <h3 className="hanghoa-buy-modal__title">Liên hệ để mua hàng</h3>
        <p className="hanghoa-buy-modal__subtitle">
          Vui lòng liên hệ theo thông tin bên dưới để được xác nhận đơn hàng.
        </p>

        <div className="hanghoa-buy-modal__product">
          {item.image ? (
            <img className="hanghoa-buy-modal__thumb" src={item.image} alt={item.name} />
          ) : (
            <div className="hanghoa-buy-modal__thumb hanghoa-buy-modal__thumb--placeholder">
              No image
            </div>
          )}
          <div className="hanghoa-buy-modal__product-info">
            <p className="hanghoa-buy-modal__product-name">{item.name}</p>
            <p className="hanghoa-buy-modal__product-price">{formatPrice(price)}</p>
            <p className="hanghoa-buy-modal__product-stock">Còn {item.quantity ?? 0} sản phẩm</p>
          </div>
        </div>

        <div className="hanghoa-buy-modal__contacts">
          {loading ? (
            <p className="hanghoa-buy-modal__state">Đang tải thông tin liên hệ...</p>
          ) : contacts.length === 0 ? (
            <p className="hanghoa-buy-modal__state">Chưa có thông tin liên hệ.</p>
          ) : (
            contacts.map((contact) => (
              <a
                key={contact.id}
                className="hanghoa-buy-modal__contact"
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="hanghoa-buy-modal__contact-icon">
                  {getContactIcon(contact.name)}
                </span>
                <span className="hanghoa-buy-modal__contact-name">{contact.name}</span>
                <span className="hanghoa-buy-modal__contact-link">{contact.link}</span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
