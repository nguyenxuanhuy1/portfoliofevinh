import { Pagination as AntdPagination } from 'antd'

export interface PaginationProps {
  current: number
  pageSize: number
  total: number
  onChange: (page: number, pageSize: number) => void
  showSizeChanger?: boolean
  hideOnSinglePage?: boolean
}

export function Pagination({
  current,
  pageSize,
  total,
  onChange,
  showSizeChanger = false,
  hideOnSinglePage = true,
}: PaginationProps) {
  return (
    <div className="ui-pagination-container">
      <AntdPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={showSizeChanger}
        hideOnSinglePage={hideOnSinglePage}
        className="ui-pagination"
      />
    </div>
  )
}

export default Pagination
