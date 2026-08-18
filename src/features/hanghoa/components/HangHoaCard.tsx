import { Link } from 'react-router-dom'
import type { HangHoa } from '../types'
import { formatPrice } from '../utils/formatPrice'

interface HangHoaCardProps {
  item: HangHoa
}

function getDiscountPercent(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}

export default function HangHoaCard({ item }: HangHoaCardProps) {
  const isSpecial = Boolean(item.isSpecial)
  const price = Number(isSpecial ? item.salePrice ?? item.recommendedPrice : item.recommendedPrice)
  const oldPrice = !isSpecial && item.oldPrice != null ? Number(item.oldPrice) : null
  const discount = getDiscountPercent(price, oldPrice)

  return (
    <Link to={`/trekking-gear-tiktok-account/${item.id}`} className="hanghoa-card">
      <div className="hanghoa-card__media">
        {item.image ? (
          <img className="hanghoa-card__image" src={item.image} alt={item.name} />
        ) : (
          <div className="hanghoa-card__image hanghoa-card__image--placeholder">No image</div>
        )}

        {isSpecial && <span className="hanghoa-card__special">Giảm giá</span>}
        {!isSpecial && discount !== null && (
          <span className="hanghoa-card__badge">-{discount}%</span>
        )}
      </div>

      <div className="hanghoa-card__body">
        <h3 className="hanghoa-card__name">{item.name}</h3>

        <div className="hanghoa-card__price-row">
          <span className="hanghoa-card__price">{formatPrice(price)}</span>
          {oldPrice !== null && oldPrice > price && (
            <span className="hanghoa-card__price-old">{formatPrice(oldPrice)}</span>
          )}
        </div>

        {isSpecial ? (
          <span className="hanghoa-card__seller">Còn {item.quantity ?? 0} sản phẩm</span>
        ) : (
          <>
            {discount !== null && <span className="hanghoa-card__discount">-{discount}%</span>}
            {item.seller && <span className="hanghoa-card__seller">{item.seller}</span>}
          </>
        )}
      </div>
    </Link>
  )
}
