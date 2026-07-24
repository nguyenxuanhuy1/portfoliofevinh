import React from 'react'
import { LoadingSpinner as GlobalLoadingSpinner } from '../../../../../components/ui/Loading/LoadingSpinner'
import './LoadingSpinner.scss'

export interface LoadingSpinnerProps extends React.ComponentProps<typeof GlobalLoadingSpinner> {}

export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return <GlobalLoadingSpinner {...props} />
}

export default LoadingSpinner