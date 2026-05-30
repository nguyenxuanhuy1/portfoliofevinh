import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import { 
  UserOutlined, 
  LockOutlined, 
  SelectOutlined, 
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

export default function LoginDefault() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const handleTabChange = (selectedTab: 'login' | 'register') => {
    setTab(selectedTab);
    setErrorMsg(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin đăng nhập');
      return;
    }

    if (tab === 'register') {
      if (password.length < 6) {
        setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Mật khẩu xác nhận không khớp');
        return;
      }
    }

    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
      const body = tab === 'login' 
        ? { username: trimmedUsername, password } 
        : { username: trimmedUsername, password, role };

      const response = await axios.post(`${baseUrl}${endpoint}`, body);
      const { data } = response.data;
      
      const { accessToken, refreshToken, role: userRole } = data;

      // Save manually to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', userRole);

      // Save to Zustand auth store
      setToken(accessToken, refreshToken, userRole);

      if (tab === 'register') {
        setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng...');
        setTimeout(() => {
          navigate(userRole === 'ADMIN' ? '/admin/profile' : '/', { replace: true });
        }, 1500);
      } else {
        navigate(userRole === 'ADMIN' ? '/admin/profile' : '/', { replace: true });
      }

    } catch (err: any) {
      console.error('Authentication request failed:', err);
      const msg = err.response?.data?.message || 'Đã xảy ra lỗi trong quá trình kết nối';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-default">
      {/* Tabs */}
      <div className="login-default__tabs">
        <button
          type="button"
          className={`login-default__tab-btn ${tab === 'login' ? 'login-default__tab-btn--active' : ''}`}
          onClick={() => handleTabChange('login')}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          className={`login-default__tab-btn ${tab === 'register' ? 'login-default__tab-btn--active' : ''}`}
          onClick={() => handleTabChange('register')}
        >
          Đăng ký
        </button>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="login-default__alert login-default__alert--error">
          <InfoCircleOutlined />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="login-default__alert login-default__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="login-default__form">
        <div className="login-default__field">
          <label className="login-default__label">
            <UserOutlined />
            Tên đăng nhập
          </label>
          <input
            className="login-default__input"
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="login-default__field">
          <label className="login-default__label">
            <LockOutlined />
            Mật khẩu
          </label>
          <input
            className="login-default__input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {tab === 'register' && (
          <>
            <div className="login-default__field">
              <label className="login-default__label">
                <LockOutlined />
                Xác nhận mật khẩu
              </label>
              <input
                className="login-default__input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="login-default__field">
              <label className="login-default__label">
                <SelectOutlined />
                Vai trò (Role)
              </label>
              <select
                className="login-default__select"
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                disabled={loading}
              >
                <option value="USER">User (Người dùng thường)</option>
                <option value="ADMIN">Admin (Quản trị viên)</option>
              </select>
            </div>
          </>
        )}

        <Button
          type="submit"
          variant="primary"
          width="100%"
          loading={loading}
        >
          {tab === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
        </Button>
      </form>
    </div>
  );
}
