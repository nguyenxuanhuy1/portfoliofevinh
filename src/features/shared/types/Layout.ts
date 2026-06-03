import type { ReactNode } from 'react'

export type LayoutType = 'main' | 'admin' | 'auth' | 'none'

export type AppRoute = {
  path: string
  element: ReactNode

  public?: boolean
  roles?: string[]

  label?: string | { vi: string; en: string }
  showInMenu?: boolean

  layout?: LayoutType
}