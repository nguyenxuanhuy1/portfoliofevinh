import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import logoPg1 from '../../../assets/logopg1.png'

interface HangHoaHeaderProps {
  onSearch: (keyword: string) => void
}

export default function HangHoaHeader({ onSearch }: HangHoaHeaderProps) {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(keyword.trim())
  }

  return (
    <header className="hanghoa-header">
      <div className="hanghoa-header__inner">
        <Link to="/hanghoa" className="hanghoa-header__logo">
          <img src={logoPg1} alt="Đồ phượt" className="hanghoa-header__logo-icon" />
          <span className="hanghoa-header__logo-text">
            <span className="hanghoa-header__logo-name">Phụ kiện phượt</span>
            <span className="hanghoa-header__logo-tagline">Giá nên mua, cập nhật liên tục</span>
          </span>
        </Link>

        <form className="hanghoa-header__search" onSubmit={handleSubmit} role="search">
          <input
            className="hanghoa-header__search-input"
            type="search"
            placeholder="Tìm sản phẩm, loại hàng..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
              if (e.target.value === '') onSearch('')
            }}
            aria-label="Tìm kiếm sản phẩm"
          />
          <button className="hanghoa-header__search-btn" type="submit">
            <SearchOutlined />
            <span className="hanghoa-header__search-btn-text">Tìm kiếm</span>
          </button>
        </form>
      </div>
    </header>
  )
}
