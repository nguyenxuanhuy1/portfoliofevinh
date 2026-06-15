import GlobalDrawer from '../../../../../components/ui/Drawer/Drawer'
import type { DrawerProps as GlobalDrawerProps } from '../../../../../components/ui/Drawer/Drawer'

export interface DrawerProps extends GlobalDrawerProps {}

export default function Drawer({ children, ...props }: DrawerProps) {
  return <GlobalDrawer {...props}>{children}</GlobalDrawer>
}
