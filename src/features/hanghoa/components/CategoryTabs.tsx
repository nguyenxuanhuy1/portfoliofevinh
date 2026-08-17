import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export interface CategoryTabItem {
  value: string
  label: string
}

interface CategoryTabsProps {
  items: CategoryTabItem[]
  value: string
  onChange: (value: string) => void
}

export default function CategoryTabs({ items, value, onChange }: CategoryTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const syncIndicator = useCallback(() => {
    const activeEl = itemRefs.current[value]
    if (!activeEl) return
    setIndicator({ left: activeEl.offsetLeft, width: activeEl.offsetWidth })
  }, [value])

  useLayoutEffect(() => {
    syncIndicator()
  }, [syncIndicator, items])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(syncIndicator)
    observer.observe(container)
    return () => observer.disconnect()
  }, [syncIndicator])

  return (
    <div className="hanghoa-tabs" role="tablist" ref={containerRef}>
      <span
        className="hanghoa-tabs__indicator"
        style={{ left: indicator.left, width: indicator.width }}
        aria-hidden="true"
      />

      {items.map((item) => {
        const active = item.value === value

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            ref={(el) => {
              itemRefs.current[item.value] = el
            }}
            className={`hanghoa-tabs__item${active ? ' hanghoa-tabs__item--active' : ''}`}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
