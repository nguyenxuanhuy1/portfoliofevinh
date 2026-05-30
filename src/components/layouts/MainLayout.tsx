import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SunOutlined, MoonOutlined, GlobalOutlined } from '@ant-design/icons'

import { routeConfig } from '../../router/routeConfig'
import { useThemeStore } from '../../store/themeStore'
import { useLanguageStore } from '../../store/languageStore'
import logo from '../../assets/logo.png'
import FloatingContactButton from '../../features/contact'

type Props = {
  children: ReactNode
}

export function MainLayout({ children }: Props) {
  const { theme, toggleTheme } = useThemeStore()
  const { language, setLanguage } = useLanguageStore()

  const menuItems = routeConfig.filter(
    (route) =>
      route.layout !== 'admin' &&
      route.showInMenu
  )

  const getDisplayLabel = (label: string | { vi: string; en: string } | undefined): string => {
    if (!label) return ''
    if (typeof label === 'string') return label
    return label[language] || ''
  }

  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <Link to="/" className="main-layout__logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        <div className="main-layout__header-right">
          <nav className="main-layout__menu">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="main-layout__menu-item"
              >
                {getDisplayLabel(item.label)}
              </Link>
            ))}
          </nav>

          <div className="main-layout__controls">
            <button
              onClick={toggleTheme}
              className="main-layout__control-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            </button>

            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="main-layout__control-btn main-layout__control-btn--lang"
              title="Change Language"
            >
              <GlobalOutlined />
              <span>{language === 'vi' ? 'EN' : 'VI'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-layout__content">
        {children}
      </main>

      <footer className="main-layout__footer">
        © {new Date().getFullYear()} Nguyễn Đức Vĩnh - Portfolio.
      </footer>

      <FloatingContactButton />
    </div>
  )
}