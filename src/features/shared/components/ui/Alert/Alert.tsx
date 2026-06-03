import React from 'react'
import GlobalAlert from '../../../../../components/ui/Alert/Alert'
import './Alert.scss'

export interface AlertProps extends React.ComponentProps<typeof GlobalAlert> {}

export default function Alert(props: AlertProps) {
  return <GlobalAlert {...props} />
}