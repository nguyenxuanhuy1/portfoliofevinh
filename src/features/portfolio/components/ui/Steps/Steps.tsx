import React from 'react'
import GlobalSteps from '../../../../../components/ui/Steps/Steps'
import './Steps.scss'

export interface StepsProps extends React.ComponentProps<typeof GlobalSteps> {}

export default function Steps(props: StepsProps) {
  return <GlobalSteps {...props} />
}