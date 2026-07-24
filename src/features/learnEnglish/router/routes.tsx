import { lazy } from 'react'
import type { AppRoute } from '../../shared/types/Layout'

const LearnEnglishListPage = lazy(() => import('../pages/vocabulary/pages/LearnEnglishListPage'))
const LearnEnglishDetailPage = lazy(() => import('../pages/vocabulary/pages/LearnEnglishDetailPage'))
const LearnEnglishHistoryPage = lazy(() => import('../pages/vocabulary/pages/LearnEnglishHistoryPage'))

export const learnEnglishRoutes: AppRoute[] = [
  {
    path: '/learn-english',
    element: <LearnEnglishListPage />,
    public: true,
    label: { 
      vi: 'Học tiếng Anh', 
      en: 'Learn English' 
    },
    showInMenu: false,
    layout: 'auth',
  },
  {
    path: '/learn-english/history',
    element: <LearnEnglishHistoryPage />,
    public: true,
    showInMenu: false,
    layout: 'auth',
  },
  {
    path: '/learn-english/:id',
    element: <LearnEnglishDetailPage />,
    public: true,
    showInMenu: false,
    layout: 'auth',
  },
]
