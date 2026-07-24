import {
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  GithubOutlined,
  LinkedinOutlined,
  SendOutlined,
  LinkOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { useContactQuery } from '../../../hooks/useContactQuery'
import { useTranslation } from '../../../i18n/useTranslation'
import Skeleton from '../../../components/ui/Skeleton'
import '../styles/homePage5.scss'

export default function HomePage5() {
  const { contacts = [], loading } = useContactQuery()
  const { t } = useTranslation()

  const getContactIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('email') || lower.includes('mail')) return <MailOutlined />
    if (lower.includes('phone') || lower.includes('tel') || lower.includes('sđt') || lower.includes('sdt')) return <PhoneOutlined />
    if (lower.includes('facebook') || lower.includes('fb')) return <FacebookOutlined />
    if (lower.includes('github') || lower.includes('git')) return <GithubOutlined />
    if (lower.includes('linkedin')) return <LinkedinOutlined />
    if (lower.includes('telegram') || lower.includes('tele') || lower.includes('tg')) return <SendOutlined />
    return <LinkOutlined />
  }

  return (
    <div className="home-page-5">
      <div className="home-page-5__content">

        {/* Header */}
        <span className="home-page-5__badge">
          {t('contactsBadge')}
        </span>
        <h2 className="home-page-5__title">
          {t('contactsTitle')}
        </h2>
        <p className="home-page-5__subtitle">
          {t('contactsSubtitle')}
        </p>

        {/* Dynamic Content */}
        {loading ? (
          <div className="home-page-5__grid">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton.Contact key={idx} />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="home-page-5__empty">
            <InfoCircleOutlined />
            <p>{t('noContacts')}</p>
          </div>
        ) : (
          <div className="home-page-5__grid">
            {contacts.map((contact) => (
              <a
                key={contact.id}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="home-page-5__card"
              >
                <div className="home-page-5__icon-wrap">
                  {getContactIcon(contact.name)}
                </div>
                <div className="home-page-5__info">
                  <span className="home-page-5__card-name">{contact.name}</span>
                  <span className="home-page-5__card-link">{contact.link.replace(/^(mailto:|tel:|https?:\/\/)/, '')}</span>
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
