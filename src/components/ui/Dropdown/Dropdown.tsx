import { Dropdown as AntDropdown } from 'antd'
import type { DropdownProps as AntDropdownProps, MenuProps } from 'antd'

export interface DropdownProps extends AntDropdownProps {
  borderRadius?: string
  width?: string
}

const Dropdown = ({
  borderRadius,
  width,
  overlayStyle,
  ...props
}: DropdownProps) => {
  const customOverlayStyle: React.CSSProperties = {
    ...(borderRadius && { borderRadius }),
    ...(width && { width }),
    ...overlayStyle,
  }

  return <AntDropdown overlayStyle={customOverlayStyle} {...props} />
}

export type { MenuProps }
export default Dropdown
export type { AntDropdownProps }