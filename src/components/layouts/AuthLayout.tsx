import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function AuthLayout({ children }: Props) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        {children}
      </div>
    </div>
  )
}