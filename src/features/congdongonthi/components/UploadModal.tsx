import { Form, Select } from 'antd'
import Modal from './ui/Modal'
import Input from './ui/Input'
import Button from './ui/Button'
import type { ExamDocument } from '../types'

interface UploadModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: Omit<ExamDocument, 'id' | 'downloads' | 'views' | 'tags' | 'pages' | 'createdAt'>) => void
  loading?: boolean
}

export default function UploadModal({ open, onClose, onSubmit, loading }: UploadModalProps) {
  const [form] = Form.useForm()

  const handleFinish = (values: any) => {
    // Generate simulated file size
    const randomSize = (Math.random() * 4 + 0.5).toFixed(1)
    const fileSize = `${randomSize} MB`

    onSubmit({
      title: values.title,
      description: values.description,
      subject: values.subject,
      fileType: values.fileType,
      author: values.author,
      fileSize,
      downloadUrl: '#',
    })
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Đóng góp tài liệu ôn thi"
      open={open}
      onCancel={handleCancel}
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        className="exam-upload-form"
      >
        <Form.Item
          name="title"
          label="Tên tài liệu"
          rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu!' }]}
        >
          <Input placeholder="Ví dụ: Đề thi thử Toán học lần 1..." />
        </Form.Item>

        <div className="exam-upload-form__row">
          <Form.Item
            name="subject"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
            className="exam-upload-form__col"
          >
            <Select placeholder="Chọn môn học" popupClassName="exam-upload-form__select-popup">
              <Select.Option value="math">math</Select.Option>
              <Select.Option value="physics">physics</Select.Option>
              <Select.Option value="chemistry">chemistry</Select.Option>
              <Select.Option value="english">english</Select.Option>
              <Select.Option value="other">other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="fileType"
            label="Định dạng file"
            rules={[{ required: true, message: 'Vui lòng chọn định dạng!' }]}
            className="exam-upload-form__col"
          >
            <Select placeholder="Định dạng" popupClassName="exam-upload-form__select-popup">
              <Select.Option value="PDF">PDF</Select.Option>
              <Select.Option value="DOCX">DOCX</Select.Option>
              <Select.Option value="ZIP">ZIP</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="author"
          label="Tác giả / Người đóng góp"
          rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
        >
          <Input placeholder="Tên của bạn hoặc nguồn tài liệu..." />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả tài liệu"
          rules={[{ required: true, message: 'Vui lòng mô tả tài liệu!' }]}
        >
          <Input.TextArea
            placeholder="Mô tả ngắn gọn nội dung tài liệu, kiến thức trọng tâm..."
            rows={4}
          />
        </Form.Item>

        <div className="exam-upload-form__actions">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={loading}
            className="exam-upload-form__cancel-btn"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="exam-upload-form__submit-btn"
          >
            Đóng góp tài liệu
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
