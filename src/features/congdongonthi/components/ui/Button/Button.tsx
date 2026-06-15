import GlobalButton from '../../../../../components/ui/Button/Button'
import type { ButtonProps } from '../../../../../components/ui/Button/Button'
import './style/Button.scss'

export default function Button({ className = '', borderRadius = '8px', ...props }: ButtonProps) {
  return (
    <GlobalButton
      borderRadius={borderRadius}
      className={`exam-ui-button ${className}`}
      {...props}
    />
  )
}

export type { ButtonProps }
