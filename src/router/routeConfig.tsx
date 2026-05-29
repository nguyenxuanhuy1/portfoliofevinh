import { lazy } from 'react'
import AuthCallbackPage from '../features/auth/page/AuthCallbackPage'

import type { AppRoute } from '../types/Layout'

const HomePage = lazy(() => import('../features/home'))
const AuthPage = lazy(() => import('../features/auth'))
const AdminProfilePage = lazy(() => import('../features/admin/adminProfile'))
const AdminSkillsPage = lazy(() => import('../features/admin/skills'))
const AdminExperiencePage = lazy(() => import('../features/admin/experience'))
const AdminContactPage = lazy(() => import('../features/admin/contact'))
const AdminProjectsPage = lazy(() => import('../features/admin/project'))
const ProjectsPage = lazy(() => import('../features/projects'))
const NotFoundPage = lazy(() => import('../features/notFound'))

export const routeConfig: AppRoute[] = [
  // user
  {
    path: '/',
    element: <HomePage />,
    public: true,
    label: { vi: 'Trang chủ', en: 'Home' },
    showInMenu: true,
    layout: 'main',
  },
  {
    path: '/projects',
    element: <ProjectsPage />,
    public: true,
    label: { vi: 'Dự án', en: 'Projects' },
    showInMenu: true,
    layout: 'main',
  },

  // admin
  {
    path: '/admin/profile',
    element: <AdminProfilePage />,
    public: false,
    roles: ['ADMIN'],
    label: { vi: 'Hồ sơ', en: 'Profile' },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/skills',
    element: <AdminSkillsPage />,
    public: false,
    roles: ['ADMIN'],
    label: { vi: 'Kỹ năng', en: 'Skills' },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/experience',
    element: <AdminExperiencePage />,
    public: false,
    roles: ['ADMIN'],
    label: { vi: 'Kinh nghiệm', en: 'Experience' },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/projects',
    element: <AdminProjectsPage />,
    public: false,
    roles: ['ADMIN'],
    label: { vi: 'Dự án', en: 'Projects' },
    showInMenu: true,
    layout: 'admin',
  },
  {
    path: '/admin/contacts',
    element: <AdminContactPage />,
    public: false,
    roles: ['ADMIN'],
    label: { vi: 'Liên hệ', en: 'Contacts' },
    showInMenu: true,
    layout: 'admin',
  },

  // auth
  {
    path: '/auth',
    element: <AuthPage />,
    public: true,
    label: { vi: 'Đăng nhập', en: 'Login' },
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
  // wildcard (Not Found)
  {
    path: '*',
    element: <NotFoundPage />,
    public: true,
    showInMenu: false,
    layout: 'none',
  },
]