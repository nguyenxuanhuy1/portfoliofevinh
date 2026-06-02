import React from 'react'
import GlobalModal from '../../../../components/ui/Modal'
import type { ModalProps } from '../../../../components/ui/Modal/Modal'
import './Modal.scss'

const Modal = ({ className = '', ...props }: ModalProps) => {
  const classes = ['admin-modal', className].filter(Boolean).join(' ')
  return <GlobalModal className={classes} {...props} />
}

// Copy static methods and wrap confirm to apply admin styling class
Modal.info = GlobalModal.info
Modal.success = GlobalModal.success
Modal.error = GlobalModal.error
Modal.warning = GlobalModal.warning

Modal.confirm = (props: any) => {
  return GlobalModal.confirm({
    ...props,
    className: ['admin-modal-confirm', props.className].filter(Boolean).join(' ')
  })
}

Modal.config = GlobalModal.config
Modal.destroyAll = GlobalModal.destroyAll

export default Modal
