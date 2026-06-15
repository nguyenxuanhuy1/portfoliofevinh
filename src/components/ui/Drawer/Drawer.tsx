import React from 'react'
import { Drawer as AntDrawer } from 'antd'
import type { DrawerProps as AntDrawerProps } from 'antd'

export interface DrawerProps extends AntDrawerProps {
  children?: React.ReactNode
}

const Drawer = ({
  children,
  placement = 'top',
  destroyOnClose = true,
  height = 'auto',
  ...rest
}: DrawerProps) => {
  return (
    <AntDrawer
      placement={placement}
      destroyOnClose={destroyOnClose}
      height={height}
      {...rest}
    >
      {children}
    </AntDrawer>
  )
}

export default Drawer
