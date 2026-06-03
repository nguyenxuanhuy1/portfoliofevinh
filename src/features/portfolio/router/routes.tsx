import { lazy } from 'react'
import type { AppRoute } from '../../shared/types/Layout'

const HomePage = lazy(() => import('../pages/home'))
const ProjectsPage = lazy(() => import('../pages/projects'))

export const portfolioRoutes: AppRoute[] = [
  {
    path: '/',
    element: <HomePage />,
    public: true,
    label: { 
      vi: 'Trang chủ', 
      en: 'Home' 
    },
    showInMenu: true,
    layout: 'main',
  },
  {
    path: '/projects',
    element: <ProjectsPage />,
    public: true,
    label: { 
      vi: 'Dự án', 
      en: 'Projects' 
    },
    showInMenu: true,
    layout: 'main',
  },
]
