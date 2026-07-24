import Button from '../../../components/ui/Button';

// ==========================================
// Biểu tượng Google (Google SVG Icon)
// ==========================================
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/**
 * Trang Đăng Nhập (LoginPage)
 * 
 * Cung cấp phương thức đăng nhập bằng Google (Single Sign-On - SSO).
 */
const LoginPage = () => {

  /**
   * Khởi chạy luồng Đăng nhập bằng Google (Google OAuth2 Flow)
   * 
   * [ LUỒNG ĐĂNG NHẬP GOOGLE CHUYỂN ĐỘNG TRỰC QUAN ]
   * 
   * Bước 1: Trình duyệt Client chuyển hướng sang Backend API
   *         URL: `GET ${baseURL}/auth/google`
   * 
   * Bước 2: Backend chuyển hướng tiếp người dùng đến màn hình xác thực tài khoản Google (OAuth Consent Screen).
   * 
   * Bước 3: Người dùng phê duyệt -> Google gửi mã Authorization Code về URL Callback của Backend 
   *         (ví dụ: `/auth/google/callback`).
   * 
   * Bước 4: Backend trao đổi mã lấy Profile người dùng, tạo JWT (accessToken, refreshToken, role),
   *         và redirect trình duyệt về địa chỉ frontend:
   *         URL: `${frontendURL}/auth/callback?accessToken=...&refreshToken=...&role=...`
   * 
   * Bước 5: Component AuthCallbackPage tại Frontend tiếp nhận, lưu token và dẫn người dùng vào trang trong.
   */
  const handleGoogleLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiBaseUrl) {
      console.error('[Google Login Error] VITE_API_BASE_URL is not defined in environment variables.');
      return;
    }

    // Thực hiện chuyển hướng trình duyệt đến API khởi tạo luồng OAuth của Backend
    window.location.href = `${apiBaseUrl}/auth/google`;
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Tiêu đề & Header */}
        <div className="login-logo">
          <span className="logo-text">Khu vực quản trị viên</span>
        </div>
        <h1 className="login-title">Chào mừng trở lại</h1>
        <p className="login-subtitle">Đăng nhập tài khoản quản trị</p>

        {/* Nút kích hoạt Đăng nhập nhanh bằng Google */}
        <Button
          variant="secondary"
          width="100%"
          icon={<GoogleIcon />}
          onClick={handleGoogleLogin}
        >
          Tiếp tục bằng Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;