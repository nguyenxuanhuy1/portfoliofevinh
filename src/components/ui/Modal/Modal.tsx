import { Modal as AntModal } from 'antd'
import type { ModalProps as AntModalProps } from 'antd'
import './Modal.scss'

export interface ModalProps extends AntModalProps {
  /** Tiêu đề modal */
  title?: React.ReactNode
  /** Nội dung bên trong */
  children?: React.ReactNode
  /** Chiều rộng tuỳ chỉnh, mặc định 480px */
  width?: number | string
}

const Modal = ({
  title,
  children,
  width = 480,
  footer = null,
  centered = true,
  destroyOnClose = true,
  ...rest
}: ModalProps) => {
  return (
    <AntModal
      title={title}
      width={width}
      footer={footer}
      centered={centered}
      destroyOnClose={destroyOnClose}
      classNames={{
        mask: 'app-modal__mask',
        wrapper: 'app-modal__wrapper',
        header: 'app-modal__header',
        body: 'app-modal__body',
        footer: 'app-modal__footer',
      }}
      {...rest}
    >
      {children}
    </AntModal>
  )
}

Modal.info = AntModal.info
Modal.success = AntModal.success
Modal.error = AntModal.error
Modal.warning = AntModal.warning
Modal.confirm = AntModal.confirm
Modal.config = AntModal.config
Modal.destroyAll = AntModal.destroyAll

export default Modal
