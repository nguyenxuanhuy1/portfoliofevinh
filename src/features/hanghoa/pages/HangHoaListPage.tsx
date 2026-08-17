import { useEffect, useMemo, useState } from 'react'
import CategoryTabs from '../components/CategoryTabs'
import HangHoaCard from '../components/HangHoaCard'
import HangHoaHeader from '../components/HangHoaHeader'
import { useGetHangHoaList } from '../hooks/useHangHoa'
import '../style/index.scss'

export default function HangHoaListPage() {
  const [category, setCategory] = useState<string>('')
  const [keyword, setKeyword] = useState('')
  const { data: items = [], isLoading } = useGetHangHoaList()

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category).filter(Boolean))),
    [items]
  )

  const tabItems = useMemo(
    () => categories.map((cat) => ({ value: cat, label: cat })),
    [categories]
  )

  // Default to first category when data arrives / current selection disappears
  useEffect(() => {
    if (categories.length === 0) {
      if (category) setCategory('')
      return
    }
    if (!category || !categories.includes(category)) {
      setCategory(categories[0])
    }
  }, [categories, category])

  const filteredItems = useMemo(() => {
    if (!category) return []
    const query = keyword.toLowerCase()

    return items.filter((item) => {
      const matchCategory = item.category === category
      const matchKeyword =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)

      return matchCategory && matchKeyword
    })
  }, [items, category, keyword])

  return (
    <div className="hanghoa-theme">
      <HangHoaHeader onSearch={setKeyword} />

      <div className="hanghoa-list">
        <div className="hanghoa-list__toolbar">
          <div className="hanghoa-list__heading">
            <h2 className="hanghoa-list__heading-title">{category || 'Sản phẩm'}</h2>
            <p className="hanghoa-list__heading-count">{filteredItems.length} sản phẩm</p>
          </div>

          {tabItems.length > 0 && (
            <CategoryTabs items={tabItems} value={category} onChange={setCategory} />
          )}
        </div>

        {isLoading ? (
          <div className="hanghoa-list__state">Đang tải hàng hóa...</div>
        ) : filteredItems.length === 0 ? (
          <div className="hanghoa-list__state">Không có hàng hóa phù hợp.</div>
        ) : (
          <div className="hanghoa-grid">
            {filteredItems.map((item) => (
              <HangHoaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
