import React from 'react'
import GlobalInput from '../../../../../components/ui/Input/Input'
import './Input.scss'

export interface InputProps extends React.ComponentProps<typeof GlobalInput> {}

const Input = (props: InputProps) => {
  return <GlobalInput {...props} />
}

Input.TextArea = GlobalInput.TextArea
Input.Password = GlobalInput.Password
Input.Search = GlobalInput.Search
Input.Group = GlobalInput.Group

export default Input