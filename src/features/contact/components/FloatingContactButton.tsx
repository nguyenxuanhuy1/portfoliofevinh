import { useState } from 'react'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  PhoneOutlined,
  MailOutlined,
  GithubOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  LinkOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { useContactQuery } from '../../../hooks/useContactQuery'
import '../style/FloatingContactButton.scss'

const getContactIcon = (name: string) => {
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
  if (lower.includes('github')) {
    return <GithubOutlined />
  }
  if (lower.includes('facebook') || lower.includes('fb')) {
    return <FacebookOutlined />
  }
  if (lower.includes('linkedin')) {
    return <LinkedinOutlined />
  }
  return <LinkOutlined />
}

export default function FloatingContactButton() {
  const { contacts, loading } = useContactQuery()
  const [open, setOpen] = useState(false)

  const menuItems: MenuProps['items'] = contacts.map((contact) => ({
    key: contact.id,
    icon: <span className="contact-dropdown__item-icon">{getContactIcon(contact.name)}</span>,
    label: (
      <a
        href={contact.link}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-dropdown__item-link"
      >
        {contact.name}
      </a>
    ),
  }))

  const items: MenuProps['items'] = loading
    ? [
        {
          key: 'loading',
          label: <span className="contact-dropdown__loading">Đang tải...</span>,
        },
      ]
    : menuItems.length === 0
    ? [
        {
          key: 'no-contact',
          label: <span className="contact-dropdown__empty">Không có liên hệ</span>,
        },
      ]
    : menuItems

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="topRight"
      overlayClassName="contact-dropdown"
      open={open}
      onOpenChange={setOpen}
    >
      <button
        className={`floating-contact-btn ${open ? 'floating-contact-btn--open' : ''}`}
        aria-label="Contact Information"
      >
        {open ? <CloseOutlined /> : <PhoneOutlined />}
      </button>
    </Dropdown>
  )
}
