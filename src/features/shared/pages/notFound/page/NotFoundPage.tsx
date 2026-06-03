import { Link } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'
import { useTranslation } from '../../../i18n/useTranslation'
import '../style/NotFound.scss'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="not-found">
      <div className="not-found__card">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">{t('notFoundTitle')}</h1>
        <p className="not-found__message">{t('notFoundMessage')}</p>

        <Link to="/" className="not-found__btn">
          <HomeOutlined />
          <span>{t('notFoundBtnGoHome')}</span>
        </Link>
      </div>
    </div>
  )
}
