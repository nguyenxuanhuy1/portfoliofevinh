import { UserOutlined, ReloadOutlined } from '@ant-design/icons'
import { useAdminProfile } from '../hook/useAdminProfile'
import { ProfileForm } from '../ui/ProfileForm'
import Button from '../../../../components/ui/Button/Button'

export default function AdminProfilePage() {
  const { profile, loading, saving, error, successMsg, fetchProfile, saveProfile, clearMessages } =
    useAdminProfile()

  return (
    <div className="admin-profile-page">
      {/* Header */}
      <div className="admin-profile-page__header">
        <div className="admin-profile-page__header-left">
          <div className="admin-profile-page__icon">
            <UserOutlined />
          </div>
          <div>
            <h1 className="admin-profile-page__title">Hồ sơ Admin</h1>
            <p className="admin-profile-page__subtitle">
              Quản lý thông tin cá nhân hiển thị trên portfolio
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<ReloadOutlined />}
          onClick={fetchProfile}
          disabled={loading}
        >
          Làm mới
        </Button>
      </div>

      {/* Card */}
      <div className="admin-profile-page__card">
        {loading ? (
          <div className="admin-profile-page__loading">
            <span className="admin-profile-page__spinner" />
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            {/* Status badge nếu profile tồn tại */}
            {profile && (
              <div className="admin-profile-page__meta">
                <span className="admin-profile-page__badge">
                  <span className="admin-profile-page__badge-dot" />
                  Đang chỉnh sửa: <strong>{profile.name}</strong>
                </span>
              </div>
            )}

            {!profile && (
              <div className="admin-profile-page__empty">
                <UserOutlined />
                <p>Chưa có hồ sơ nào. Hãy tạo hồ sơ của bạn.</p>
              </div>
            )}

            <ProfileForm
              profile={profile}
              saving={saving}
              error={error}
              successMsg={successMsg}
              onSubmit={saveProfile}
              onClearMessages={clearMessages}
            />
          </>
        )}
      </div>
    </div>
  )
}
