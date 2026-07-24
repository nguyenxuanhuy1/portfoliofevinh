import React from 'react'
import GlobalDropdown from '../../../../../components/ui/Dropdown/Dropdown'
import './Dropdown.scss'

export interface DropdownProps extends React.ComponentProps<typeof GlobalDropdown> {}

export default function Dropdown(props: DropdownProps) {
  return <GlobalDropdown {...props} />
}