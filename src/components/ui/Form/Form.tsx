import { Form as AntForm } from 'antd'
import type { FormProps as AntFormProps } from 'antd'

export interface FormProps<Values = any> extends AntFormProps<Values> {
  width?: string
  margin?: string
  padding?: string
}

const Form = <Values extends object = any>({
  width,
  margin,
  padding,
  style,
  className = '',
  ...props
}: FormProps<Values>) => {
  const customStyle: React.CSSProperties = {
    ...(width && { width }),
    ...(margin && { margin }),
    ...(padding && { padding }),
    ...style,
  }

  const classes = ['app-form', className].filter(Boolean).join(' ')

  return <AntForm style={customStyle} className={classes} {...(props as any)} />
}

Form.useForm = AntForm.useForm
Form.Item = AntForm.Item
Form.List = AntForm.List
Form.ErrorList = AntForm.ErrorList
Form.Provider = AntForm.Provider

export default Form
export type { AntFormProps }
