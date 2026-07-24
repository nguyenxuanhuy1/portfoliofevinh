import React from 'react'
import GlobalPagination from '../../../../../components/ui/Pagination/Pagination'
import './Pagination.scss'

export interface PaginationProps extends React.ComponentProps<typeof GlobalPagination> {}

export default function Pagination(props: PaginationProps) {
  return <GlobalPagination {...props} />
}