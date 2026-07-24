import React from 'react'
import GlobalButton from '../../../../../components/ui/Button/Button'
import './Button.scss'

type ButtonVariant = 'brand' | 'secondary' | 'danger' | 'success' | 'warning' | 'dark' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

export interface ButtonProps extends Omit<React.ComponentProps<typeof GlobalButton>, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({ 
  children, 
  className = '', 
  variant = 'brand',
  size = 'base',
  ...props
}: ButtonProps) {
  const variantClass = `btn--nb-${variant}`
  const sizeClass = `btn--nb-${size}`

  return (
    <GlobalButton 
      className={`learn-english-btn ${variantClass} ${sizeClass} ${className}`} 
      {...props}
    >
      {children}
    </GlobalButton>
  )
}