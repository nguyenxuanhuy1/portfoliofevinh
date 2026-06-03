import { useState, useEffect } from 'react'
import Modal from '../../../../components/ui/Modal'
import Button from '../../../../components/ui/Button'
import Form from '../../../../../../components/ui/Form'
import Input from '../../../../components/ui/Input'
import Alert from '../../../../components/ui/Alert'
import type { LearnTopic } from '../../../../../learnEnglish/types/LearnEnglish'

interface AdminTopicModalProps {
  open: boolean
  editTarget: LearnTopic | null
  saving: boolean
  onClose: () => void
  onSubmit: (name: string, data: any) => Promise<boolean>
}

const DEFAULT_JSON_TEMPLATE = `{
  "topic": "Chủ đề mẫu",
  "reading_passage": {
    "title": "A Great Day",
    "content": "Write a simple English passage here (150-200 words)..."
  },
  "vocabulary": [
    {
      "word": "awesome",
      "vietnamese": "tuyệt vời",
      "example": "This learning platform is awesome!"
    }
  ],
  "exercises": [
    {
      "tier": 1,
      "type": "matching",
      "goal": "recognition",
      "instruction": "Nối từ tiếng Anh với nghĩa tiếng Việt đúng.",
      "questions": [
        {
          "id": 1,
          "word": "awesome",
          "options": ["tuyệt vời", "tệ hại", "buồn chán", "mệt mỏi"],
          "answer": "tuyệt vời"
        }
      ]
    }
  ],
  "summary": {
    "key_vocabulary": [
      { "english": "awesome", "vietnamese": "tuyệt vời" }
    ],
    "grammar_notes": ["Simple sentences using is/are."],
    "common_mistakes": ["Confusing awesome with awful."]
  },
  "improvement_suggestions": [
    {
      "method": "Flashcards",
      "description": "Create flashcards for new words.",
      "how_to_apply": "Practice 5 minutes daily."
    }
  ]
}`

export function AdminTopicModal({
  open,
  editTarget,
  saving,
  onClose,
  onSubmit,
}: AdminTopicModalProps) {
  const [form] = Form.useForm()
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      if (editTarget) {
        form.setFieldsValue({
          name: editTarget.name,
          jsonData: JSON.stringify(editTarget.data, null, 2)
        })
      } else {
        form.setFieldsValue({
          name: '',
          jsonData: DEFAULT_JSON_TEMPLATE
        })
      }
      setValidationError(null)
    }
  }, [open, editTarget, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setValidationError(null)

      let parsedData: any
      try {
        parsedData = JSON.parse(values.jsonData)
      } catch (err: any) {
        setValidationError(`Dữ liệu JSON không hợp lệ! Vui lòng kiểm tra lỗi dấu phẩy, dấu ngoặc hoặc định dạng. Chi tiết lỗi: ${err.message}`)
        return
      }

      // Check for some required keys in json
      if (!parsedData.topic || !parsedData.reading_passage || !parsedData.vocabulary || !parsedData.exercises) {
        setValidationError('Cấu trúc JSON thiếu các trường bắt buộc (topic, reading_passage, vocabulary, exercises)!')
        return
      }

      const success = await onSubmit(values.name, parsedData)
      if (success) {
        onClose()
      }
    } catch (err) {
      console.error('Validation failed:', err)
    }
  }

  return (
    <Modal
      open={open}
      title={editTarget ? 'Chỉnh Sửa Chủ Đề Học' : 'Thêm Chủ Đề Học Mới'}
      okText="Lưu lại"
      cancelText="Hủy bỏ"
      width={720}
      className="admin-topic-modal"
      onCancel={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button key="cancel" variant="secondary" size="md" onClick={onClose} disabled={saving}>
            Hủy bỏ
          </Button>
          <Button key="submit" variant="primary" size="md" loading={saving} onClick={handleSave}>
            Lưu lại
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
        <Form.Item
          name="name"
          label="Tên chủ đề hiển thị"
          rules={[{ required: true, message: 'Vui lòng nhập tên chủ đề!' }]}
        >
          <Input placeholder="Ví dụ: Unit 2 - Daily Routine" />
        </Form.Item>

        <Form.Item
          name="jsonData"
          label="Nội dung dữ liệu JSON (Cấu trúc tương ứng topicExplain.md)"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung JSON!' }]}
          extra="Hãy dán nội dung JSON được tạo từ AI hoặc soạn thảo sẵn."
        >
          <Input.TextArea
            rows={15}
            placeholder="Dán dữ liệu JSON vào đây..."
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </Form.Item>
      </Form>

      {validationError && (
        <Alert
          message="Lỗi Dữ Liệu"
          description={validationError}
          type="error"
          showIcon
          style={{ marginTop: '16px' }}
        />
      )}
    </Modal>
  )
}
