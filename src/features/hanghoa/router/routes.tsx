import { lazy } from 'react'
import type { AppRoute } from '../../shared/types/Layout'

const HangHoaListPage = lazy(() => import('../pages/HangHoaListPage'))
const HangHoaDetailPage = lazy(() => import('../pages/HangHoaDetailPage'))

export const hangHoaRoutes: AppRoute[] = [
  {
    path: '/trekking-gear-tiktok-account',
    element: <HangHoaListPage />,
    public: true,
    label: {
      vi: 'Đồ phượt',
      en: 'Products',
    },
    showInMenu: false,
    layout: 'none',
  },
  {
    path: '/trekking-gear-tiktok-account/:id',
    element: <HangHoaDetailPage />,
    public: true,
    label: {
      vi: 'Chi tiết đồ phượt',
      en: 'Product Detail',
    },
    showInMenu: false,
    layout: 'none',
  },
]
