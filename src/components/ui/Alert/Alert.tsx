import { Alert as AntAlert } from 'antd'
import type { AlertProps as AntAlertProps } from 'antd'

export interface AlertProps extends AntAlertProps {
  borderRadius?: string
  bgColor?: string
  color?: string
  width?: string
  padding?: string
}

const Alert = ({
  borderRadius,
  bgColor,
  color,
  width,
  padding,
  style,
  className = '',
  ...props
}: AlertProps) => {
  const customStyle: React.CSSProperties = {
    ...(borderRadius && { borderRadius }),
    ...(bgColor && { backgroundColor: bgColor }),
    ...(color && { color }),
    ...(width && { width }),
    ...(padding && { padding }),
    ...style,
  }

  const classes = ['app-alert', className].filter(Boolean).join(' ')

  return <AntAlert style={customStyle} className={classes} {...props} />
}

export default Alert
export type { AntAlertProps }
