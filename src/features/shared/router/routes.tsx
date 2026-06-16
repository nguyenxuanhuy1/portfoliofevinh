import { lazy } from 'react'
import type { AppRoute } from '../types/Layout'

// Authentication
const AuthPage = lazy(() => import('../pages/auth'))
const AuthCallbackPage = lazy(() => import('../pages/auth/components/AuthCallbackPage'))

// Administrator Panel
const AdminProfilePage = lazy(() => import('../pages/admin/adminProfile'))
const AdminSkillsPage = lazy(() => import('../pages/admin/skills'))
const AdminExperiencePage = lazy(() => import('../pages/admin/experience'))
const AdminProjectsPage = lazy(() => import('../pages/admin/project'))
const AdminContactPage = lazy(() => import('../pages/admin/contact'))
const AdminTopicPage = lazy(() => import('../pages/admin/topic'))
const CongDongOnThiAdminPage = lazy(() => import('../pages/admin/document'))

// Fallback
const NotFoundPage = lazy(() => import('../pages/notFound'))

export const sharedRoutes: AppRoute[] = [
  {
    path: '/admin/profile',
    element: <AdminProfilePage />,
    public: false,
    roles: ['ADMIN'],
    label: {
      vi: 'Hồ sơ',
      en: 'Profile'
    },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/skills',
    element: <AdminSkillsPage />,
    public: false,
    roles: ['ADMIN'],
    label: {
      vi: 'Kỹ năng',
      en: 'Skills'
    },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/experience',
    element: <AdminExperiencePage />,
    public: false,
    roles: ['ADMIN'],
    label: {
      vi: 'Kinh nghiệm',
      en: 'Experience'
    },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/projects',
    element: <AdminProjectsPage />,
    public: false,
    roles: ['ADMIN'],
    label: {
      vi: 'Dự án',
      en: 'Projects'
    },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/contacts',
    element: <AdminContactPage />,
    public: false,
    roles: ['ADMIN'],
    label: {
      vi: 'Liên hệ',
      en: 'Contacts'
    },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/topics',
    element: <AdminTopicPage />,
    public: false,
    roles: ['ADMIN'],
    label: {
      vi: 'Chủ đề học',
      en: 'English Topics'
    },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/documents',
    element: <CongDongOnThiAdminPage />,
    public: false,
    roles: ['ADMIN'],
    label: {
      vi: 'Tài liệu ôn thi',
      en: 'Exam Documents'
    },
    showInMenu: true,
    layout: 'admin',
  },
  // Auth
  {
    path: '/auth',
    element: <AuthPage />,
    public: true,
    label: {
      vi: 'Đăng nhập',
      en: 'Login'
    },
    showInMenu: true,
    layout: 'auth',
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
    public: true,
    showInMenu: false,
    layout: 'auth',
  },
  // Wildcard fallback
  {
    path: '*',
    element: <NotFoundPage />,
    public: true,
    showInMenu: false,
    layout: 'none',
  },
]
