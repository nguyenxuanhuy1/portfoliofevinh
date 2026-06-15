import GlobalModal from '../../../../../components/ui/Modal/Modal'
import type { ModalProps } from '../../../../../components/ui/Modal/Modal'
import './style/Modal.scss'

export default function Modal({ className = '', ...props }: ModalProps) {
  return (
    <GlobalModal
      className={`exam-ui-modal ${className}`}
      {...props}
    />
  )
}

export type { ModalProps }
