import React from 'react'
import GlobalButton from '../../../../components/ui/Button/Button'

interface ButtonProps extends React.ComponentProps<typeof GlobalButton> {
  // Custom props specific to learnEnglish if any
}

export default function Button({ children, className = '', color = '', ...props }: ButtonProps) {
  // Standard wrapper extending the global button component
  return (
    <GlobalButton className={className} color={color} {...props}>
      {children}
    </GlobalButton>
  )
}
