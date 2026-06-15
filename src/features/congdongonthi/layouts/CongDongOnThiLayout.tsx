import React from 'react'
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons'
import Input from '../components/ui/Input'
import Drawer from '../components/ui/Drawer'

interface CongDongOnThiLayoutProps {
  children: React.ReactNode
  activeDocId: string | null
  onBack: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export default function CongDongOnThiLayout({
  children,
  activeDocId,
  searchValue,
  onSearchChange,
  onBack,
}: CongDongOnThiLayoutProps) {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = React.useState(false)

  return (
    <div className="congdongonthi-theme">
      {/* TOP BAR / SEARCH */}
      <div className="exam-top-bar">
        <span className="exam-top-bar__title" onClick={onBack} style={{ cursor: 'pointer' }}>
          <span className="exam-top-bar__title-bold">Cộng đồng ôn thi</span>
        </span>
        {activeDocId ? (
          <button className="exam-top-bar__back-btn" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: '16px' }}>
            <ArrowLeftOutlined /> Quay lại
          </button>
        ) : (
          <>
            <div className="exam-top-bar__search-wrapper exam-top-bar__search-desktop">
              <Input
                prefix={<SearchOutlined style={{ color: 'var(--exam-primary)' }} />}
                placeholder="Tìm kiếm tài liệu học tập..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="exam-top-bar__search-input"
                allowClear
              />
            </div>
            <button 
              className="exam-top-bar__search-trigger"
              onClick={() => setIsSearchDrawerOpen(!isSearchDrawerOpen)}
              aria-label="Toggle search"
            >
              <SearchOutlined />
            </button>
          </>
        )}
      </div>

      {/* Mobile Search Drawer (AntD Drawer covering top of screen) */}
      {!activeDocId && (
        <Drawer
          open={isSearchDrawerOpen}
          onClose={() => setIsSearchDrawerOpen(false)}
          placement="top"
          closable={false}
          maskClosable={true}
          className="exam-search-drawer-antd"
          height={80}
        >
          <div className="exam-search-drawer-antd__wrapper">
            <div className="exam-search-drawer-antd__content">
              <Input
                prefix={<SearchOutlined style={{ color: 'var(--exam-primary)' }} />}
                placeholder="Tìm kiếm tài liệu học tập..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="exam-top-bar__search-input"
                allowClear
                autoFocus={isSearchDrawerOpen}
              />
            </div>
          </div>
        </Drawer>
      )}

      {/* MAIN CONTENT */}
      {children}
    </div>
  )
}
