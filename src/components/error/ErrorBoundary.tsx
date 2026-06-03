import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import { useTranslation } from '../../features/shared/i18n/useTranslation'
import './style/Error.scss'

type Props = {
    children: ReactNode
    fallback?: ReactNode
}

type State = {
    hasError: boolean
}

const ErrorFallback = () => {
    const { t } = useTranslation()

    return (
        <div className="app-error">
            <div className="app-error__card">
                <div className="app-error__icon-wrap">
                    <CloseCircleOutlined />
                </div>
                <h2 className="app-error__title">{t('errorSomethingWrong')}</h2>
                <p className="app-error__message">{t('errorMessageBoundary')}</p>

                <button className="app-error__button" onClick={() => window.location.reload()}>
                    {t('errorBtnRefresh')}
                </button>
            </div>
        </div>
    )
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
    }

    static getDerivedStateFromError() {
        return {
            hasError: true,
        }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? <ErrorFallback />
        }

        return this.props.children
    }
}