import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ContactBuyModal from '../components/ContactBuyModal'
import HangHoaHeader from '../components/HangHoaHeader'
import HtmlPreview from '../components/HtmlPreview'
import { useGetHangHoaById } from '../hooks/useHangHoa'
import { formatPrice } from '../utils/formatPrice'
import '../style/index.scss'

export default function HangHoaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: item, isLoading, isError } = useGetHangHoaById(id)
  const [buyModalOpen, setBuyModalOpen] = useState(false)

  const compareSectionRef = useRef<HTMLElement>(null)

  const goToCompare = () => {
    compareSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goToSeller = () => {
    const link = item?.productLink?.trim()
    if (!link) {
      goToCompare()
      return
    }
    const url = /^https?:\/\//i.test(link) ? link : `https://${link}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (isLoading) {
    return (
      <div className="hanghoa-theme">
        <HangHoaHeader onSearch={() => {}} />
        <div className="hanghoa-detail hanghoa-detail--state">Đang tải chi tiết...</div>
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div className="hanghoa-theme">
        <HangHoaHeader onSearch={() => {}} />
        <div className="hanghoa-detail hanghoa-detail--state">
          <p>Không tìm thấy hàng hóa.</p>
          <Link to="/hanghoa" className="hanghoa-detail__crumb">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  const isSpecial = Boolean(item.isSpecial)
  const displayPrice = isSpecial
    ? item.salePrice ?? item.recommendedPrice
    : item.recommendedPrice
  const inStock = (item.quantity ?? 0) > 0

  return (
    <div className="hanghoa-theme">
      <HangHoaHeader onSearch={() => {}} />

      <div className="hanghoa-detail">
        <nav className="hanghoa-detail__breadcrumb" aria-label="Breadcrumb">
          <Link to="/hanghoa" className="hanghoa-detail__crumb">
            Trang chủ
          </Link>
          <span className="hanghoa-detail__crumb-sep">/</span>
          <span className="hanghoa-detail__crumb">{item.category}</span>
          <span className="hanghoa-detail__crumb-sep">/</span>
          <span className="hanghoa-detail__crumb hanghoa-detail__crumb--current">{item.name}</span>
        </nav>

        <div className="hanghoa-detail__card">
          <div className="hanghoa-detail__gallery">
            {item.image ? (
              <img src={item.image} alt={item.name} className="hanghoa-detail__image" />
            ) : (
              <div className="hanghoa-detail__image hanghoa-detail__image--placeholder">
                No image
              </div>
            )}
          </div>

          <div className="hanghoa-detail__info">
            <h1 className="hanghoa-detail__name">{item.name}</h1>

            {!isSpecial && (
              <div className="hanghoa-detail__seller-row">
                <span className="hanghoa-detail__seller-label">Gợi ý nơi bán giá rẻ nhất:</span>
                {item.platformImage && (
                  <img
                    src={item.platformImage}
                    alt="Nơi bán"
                    className="hanghoa-detail__seller-logo"
                  />
                )}
                {item.seller && <span className="hanghoa-detail__seller-name">{item.seller}</span>}
              </div>
            )}

            <p className="hanghoa-detail__price">{formatPrice(displayPrice)}</p>

            {isSpecial ? (
              <>
                <p className="hanghoa-detail__stock">
                  Số lượng còn lại:{' '}
                  <strong className={inStock ? '' : 'hanghoa-detail__stock--out'}>
                    {item.quantity ?? 0}
                  </strong>
                </p>

                <div className="hanghoa-detail__seller-row">
                  <span className="hanghoa-detail__seller-name">
                    Vui lòng liên hệ qua zalo:{' '}
                    <a
                      href="https://zalo.me/0961373058"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      0961373058
                    </a>{' '}
                    để giao dịch
                  </span>
                </div>

                <div className="hanghoa-detail__actions">
                  <button
                    type="button"
                    className="hanghoa-detail__btn hanghoa-detail__btn--primary"
                    disabled={!inStock}
                    onClick={() => setBuyModalOpen(true)}
                  >
                    {inStock ? 'Mua ngay' : 'Hết hàng'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="hanghoa-detail__price-note">
                  Giá nên mua, có thể thay đổi theo thời điểm trên sàn.
                </p>

                <div className="hanghoa-detail__actions">
                  <button
                    type="button"
                    className="hanghoa-detail__btn hanghoa-detail__btn--primary"
                    onClick={goToSeller}
                    disabled={!item.productLink}
                    title={item.productLink ? undefined : 'Chưa có link nơi bán'}
                  >
                    Đến nơi bán
                  </button>
                  <button
                    type="button"
                    className="hanghoa-detail__btn hanghoa-detail__btn--outline"
                    onClick={goToCompare}
                  >
                    So sánh giá
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {!isSpecial && (
          <section className="hanghoa-detail__section" ref={compareSectionRef}>
            <h2 className="hanghoa-detail__section-title">Sản phẩm tốt nhất giữa các sàn thương mại điện tử:</h2>
            {item.htmlContent ? (
              <HtmlPreview html={item.htmlContent} title={item.name} />
            ) : (
              <div className="hanghoa-detail__panel-empty">(Đang cập nhật)</div>
            )}
          </section>
        )}
      </div>

      {!isSpecial && (
        <footer className="hanghoa-footer">
          <div className="hanghoa-footer__inner">
            <p className="hanghoa-footer__title">Lưu ý</p>
            <p className="hanghoa-footer__note">
              Giá cả có thể cao hơn so với lần cập nhật gần nhất. Chúng tôi rất tiếc vì không thể cập
              nhật liên tục giá niêm yết trên trang web cửa hàng theo từng thời điểm.
            </p>
          </div>
        </footer>
      )}

      {isSpecial && (
        <ContactBuyModal open={buyModalOpen} item={item} onClose={() => setBuyModalOpen(false)} />
      )}
    </div>
  )
}
