import React from 'react'
import GlobalButton from '../../../../../components/ui/Button/Button'
import './Button.scss'

export interface ButtonProps extends React.ComponentProps<typeof GlobalButton> {}

export default function Button({ children, ...props }: ButtonProps) {
  return <GlobalButton {...props}>{children}</GlobalButton>
}