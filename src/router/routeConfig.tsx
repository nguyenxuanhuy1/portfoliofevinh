import { lazy } from 'react'
import AuthCallbackPage from '../features/auth/components/AuthCallbackPage'
import type { AppRoute } from '../types/Layout'

// ==========================================
// Lazy Loaded Feature Pages (Code Splitting)
// ==========================================

// Client-facing Pages
const HomePage = lazy(() => import('../features/home'))
const ProjectsPage = lazy(() => import('../features/projects'))

// Authentication Page
const AuthPage = lazy(() => import('../features/auth'))

// Administrator Panel Pages
const AdminProfilePage = lazy(() => import('../features/admin/adminProfile'))
const AdminSkillsPage = lazy(() => import('../features/admin/skills'))
const AdminExperiencePage = lazy(() => import('../features/admin/experience'))
const AdminProjectsPage = lazy(() => import('../features/admin/project'))
const AdminContactPage = lazy(() => import('../features/admin/contact'))

// Fallback Page
const NotFoundPage = lazy(() => import('../features/notFound'))

/**
 * Global Routing Configuration of the Application.
 * Each route defines how React Router maps a URL path to a React component,
 * controls permission access (public/private, roles restriction), and specifies 
 * localization labels along with layout templates.
 */
export const routeConfig: AppRoute[] = [
  // ----------------------------------------------------
  // 1. Client-facing (Public) Section
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // 2. Administrator (Private) Section
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // 3. Authentication Section
  // ----------------------------------------------------
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
    showInMenu: false, // Callback handling is internal, don't display in menu
    layout: 'auth',
  },

  // ----------------------------------------------------
  // 4. Wildcard / Fallback Section
  // ----------------------------------------------------
  {
    path: '*',
    element: <NotFoundPage />,
    public: true,
    showInMenu: false, // 404 page is dynamic, hide from navigation menu
    layout: 'none',
  },
]
