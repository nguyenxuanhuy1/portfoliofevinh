import type { ReactNode } from 'react'

import { MainLayout } from './MainLayout'
import { AdminLayout } from './AdminLayout'
import { AuthLayout } from './AuthLayout'

import type { LayoutType } from '../../features/shared/types/Layout'

import './style/index.scss'
type Props = {
  layout?: LayoutType
  children: ReactNode
}

export function LayoutRenderer({ layout = 'main', children }: Props) {
  switch (layout) {
    case 'admin':
      return <AdminLayout>{children}</AdminLayout>

    case 'auth':
      return <AuthLayout>{children}</AuthLayout>

    case 'none':
      return <>{children}</>

    case 'main':
    default:
      return <MainLayout>{children}</MainLayout>
  }
}