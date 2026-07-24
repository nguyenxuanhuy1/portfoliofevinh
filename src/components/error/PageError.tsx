import { CloseCircleOutlined } from '@ant-design/icons'
import { useTranslation } from '../../features/shared/i18n/useTranslation'
import './style/Error.scss'

export function PageError() {
  const { t } = useTranslation()

  return (
    <div className="app-error">
      <div className="app-error__card">
        <div className="app-error__icon-wrap">
          <CloseCircleOutlined />
        </div>
        <h2 className="app-error__title">{t('errorFailedToLoad')}</h2>
        <p className="app-error__message">{t('errorMessagePage')}</p>

        <button className="app-error__button" onClick={() => window.location.reload()}>
          {t('errorBtnRefresh')}
        </button>
      </div>
    </div>
  )
}