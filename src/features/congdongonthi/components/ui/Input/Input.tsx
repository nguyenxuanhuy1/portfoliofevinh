import GlobalInput from '../../../../../components/ui/Input/Input'
import type { InputProps, TextAreaProps } from '../../../../../components/ui/Input/Input'
import './style/Input.scss'

const Input = ({ className = '', borderRadius = '8px', ...props }: InputProps) => {
  return (
    <GlobalInput
      borderRadius={borderRadius}
      className={`exam-ui-input ${className}`}
      {...props}
    />
  )
}

const TextArea = ({ className = '', borderRadius = '8px', ...props }: TextAreaProps) => {
  return (
    <GlobalInput.TextArea
      borderRadius={borderRadius}
      className={`exam-ui-textarea ${className}`}
      {...props}
    />
  )
}

Input.TextArea = TextArea
Input.Password = GlobalInput.Password
Input.Search = GlobalInput.Search
Input.Group = GlobalInput.Group

export default Input
export type { InputProps, TextAreaProps }
