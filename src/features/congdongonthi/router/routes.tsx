import { lazy } from 'react'
import type { AppRoute } from '../../shared/types/Layout'

const CongDongOnThiListPage = lazy(() => import('../pages/CongDongOnThiListPage'))
const CongDongOnThiDetailPage = lazy(() => import('../pages/CongDongOnThiDetailPage'))
const CongDongOnThiSearchPage = lazy(() => import('../pages/CongDongOnThiSearchPage'))

export const congDongOnThiRoutes: AppRoute[] = [
  {
    path: '/congdongonthi',
    element: <CongDongOnThiListPage />,
    public: true,
    label: {
      vi: 'Cộng đồng ôn thi',
      en: 'Exam Community',
    },
    showInMenu: false,
    layout: 'none',
  },
  {
    path: '/congdongonthi/search',
    element: <CongDongOnThiSearchPage />,
    public: true,
    label: {
      vi: 'Tìm kiếm tài liệu',
      en: 'Search Documents',
    },
    showInMenu: false,
    layout: 'none',
  },
  {
    path: '/congdongonthi/:id',
    element: <CongDongOnThiDetailPage />,
    public: true,
    label: {
      vi: 'Chi tiết tài liệu',
      en: 'Document Detail',
    },
    showInMenu: false,
    layout: 'none',
  },
]
