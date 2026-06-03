import { useState, useEffect, type FormEvent } from 'react'
import {
  UserOutlined,
  CodeOutlined,
  FileTextOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import Button from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import type { AdminProfile, AdminProfileFormData, WorkStatus } from '../../../../types/AdminProfile'

interface Props {
  profile: AdminProfile | null
  saving: boolean
  error: string | null
  successMsg: string | null
  onSubmit: (data: AdminProfileFormData) => void
  onClearMessages: () => void
}

const WORK_STATUS_OPTIONS: { value: WorkStatus; label: string; color: string }[] = [
  { value: 'READY', label: 'Sẵn sàng làm việc', color: '#34d399' },
  { value: 'NOT_READY', label: 'Đang bận', color: '#fbbf24' },
]

export function ProfileForm({ profile, saving, error, successMsg, onSubmit, onClearMessages }: Props) {
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [workStatus, setWorkStatus] = useState<WorkStatus>('READY')

  // Sync form khi profile load xong
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
      setPosition(profile.position ?? '')
      setBio(profile.bio ?? '')
      setSkills(profile.skills ?? [])
      setWorkStatus(profile.workStatus ?? 'READY')
    }
  }, [profile])

  const handleAddSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed])
    }
    setSkillInput('')
  }

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onClearMessages()
    onSubmit({ name, position, bio, skills, workStatus })
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {/* Thông báo */}
      {successMsg && (
        <div className="profile-form__alert profile-form__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="profile-form__alert profile-form__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      <div className="profile-form__grid">
        {/* Name */}
        <div className="profile-form__field">
          <label className="profile-form__label">
            <UserOutlined />
            Họ và tên
          </label>
          <Input
            className="profile-form__input"
            type="text"
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Position */}
        <div className="profile-form__field">
          <label className="profile-form__label">
            <CodeOutlined />
            Vị trí / Nghề nghiệp
          </label>
          <Input
            className="profile-form__input"
            type="text"
            placeholder="Full-stack Developer"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Bio */}
      <div className="profile-form__field">
        <label className="profile-form__label">
          <FileTextOutlined />
          Giới thiệu bản thân
        </label>
        <Input.TextArea
          className="profile-form__textarea"
          rows={5}
          placeholder="Mô tả ngắn về bản thân, kinh nghiệm, mục tiêu..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </div>

      {/* Skills */}
      <div className="profile-form__field">
        <label className="profile-form__label">
          <TagsOutlined />
          Kỹ năng
        </label>
        <div className="profile-form__skill-input-row">
          <Input
            className="profile-form__input"
            type="text"
            placeholder="Nhập kỹ năng và nhấn Enter hoặc +"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
          />
          <Button
            type="button"
            variant="secondary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleAddSkill}
          >
            Thêm
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="profile-form__tags">
            {skills.map((skill) => (
              <span key={skill} className="profile-form__tag">
                {skill}
                <button
                  type="button"
                  className="profile-form__tag-remove"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  <CloseOutlined />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Work Status */}
      <div className="profile-form__field">
        <label className="profile-form__label">Trạng thái làm việc</label>
        <div className="profile-form__status-group">
          {WORK_STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`profile-form__status-option ${workStatus === opt.value ? 'profile-form__status-option--active' : ''}`}
              style={{ '--status-color': opt.color } as React.CSSProperties}
            >
              <input
                type="radio"
                name="workStatus"
                value={opt.value}
                checked={workStatus === opt.value}
                onChange={() => setWorkStatus(opt.value)}
              />
              <span className="profile-form__status-dot" />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="profile-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={saving}
          width="100%"
        >
          {profile?.id ? 'Lưu thay đổi' : 'Tạo hồ sơ'}
        </Button>
      </div>
    </form>
  )
}
