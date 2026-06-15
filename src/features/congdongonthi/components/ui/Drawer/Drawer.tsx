import React from 'react'
import GlobalDrawer from '../../../../../components/ui/Drawer/Drawer'
import type { DrawerProps } from '../../../../../components/ui/Drawer/Drawer'
import './style/Drawer.scss'

export default function Drawer({ className = '', ...props }: DrawerProps) {
  return (
    <GlobalDrawer
      className={`exam-ui-drawer ${className}`}
      getContainer={() => document.querySelector('.congdongonthi-theme') || document.body}
      {...props}
    />
  )
}

export type { DrawerProps }
