import { Input as AntInput } from 'antd'
import type { InputProps as AntInputProps } from 'antd'
import type { TextAreaProps as AntTextAreaProps } from 'antd/es/input'
import './Input.scss'

export interface InputProps extends AntInputProps {
  borderRadius?: string
  bgColor?: string
  color?: string
  borderColor?: string
  width?: string
  height?: string
  padding?: string
}

export interface TextAreaProps extends AntTextAreaProps {
  borderRadius?: string
  bgColor?: string
  color?: string
  borderColor?: string
  width?: string
  height?: string
  padding?: string
}

const Input = ({
  borderRadius,
  bgColor,
  color,
  borderColor,
  width,
  height,
  padding,
  style,
  className = '',
  ...props
}: InputProps) => {
  const customStyle: React.CSSProperties = {
    ...(borderRadius && { borderRadius }),
    ...(bgColor && { backgroundColor: bgColor }),
    ...(color && { color }),
    ...(borderColor && { borderColor }),
    ...(width && { width }),
    ...(height && { height }),
    ...(padding && { padding }),
    ...style,
  }

  const classes = ['app-input', className].filter(Boolean).join(' ')

  return <AntInput style={customStyle} className={classes} {...props} />
}

const TextArea = ({
  borderRadius,
  bgColor,
  color,
  borderColor,
  width,
  height,
  padding,
  style,
  className = '',
  ...props
}: TextAreaProps) => {
  const customStyle: React.CSSProperties = {
    ...(borderRadius && { borderRadius }),
    ...(bgColor && { backgroundColor: bgColor }),
    ...(color && { color }),
    ...(borderColor && { borderColor }),
    ...(width && { width }),
    ...(height && { height }),
    ...(padding && { padding }),
    ...style,
  }

  const classes = ['app-textarea', className].filter(Boolean).join(' ')

  return <AntInput.TextArea style={customStyle} className={classes} {...props} />
}

Input.TextArea = TextArea
Input.Password = AntInput.Password
Input.Search = AntInput.Search
Input.Group = AntInput.Group

export default Input
export type { AntInputProps }
