import React from 'react'
import GlobalButton from '../../../../../components/ui/Button/Button'
import './Button.scss'

export interface ButtonProps extends React.ComponentProps<typeof GlobalButton> {}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <GlobalButton className={`learn-english-btn ${className}`} {...props}>
      {children}
    </GlobalButton>
  )
}