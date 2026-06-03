import React from 'react'
import GlobalModal from '../../../../../components/ui/Modal/Modal'
import './Modal.scss'

export interface ModalProps extends React.ComponentProps<typeof GlobalModal> {}

const Modal = ({ children, ...props }: ModalProps) => {
  return <GlobalModal {...props}>{children}</GlobalModal>
}

Modal.info = GlobalModal.info
Modal.success = GlobalModal.success
Modal.error = GlobalModal.error
Modal.warning = GlobalModal.warning
Modal.confirm = GlobalModal.confirm
Modal.config = GlobalModal.config
Modal.destroyAll = GlobalModal.destroyAll

export default Modal