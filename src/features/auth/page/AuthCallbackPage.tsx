import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { LoadingSpinner } from '../../../components/ui/Loading/LoadingSpinner';
const saveLog = (message: string, data?: any) => {
  const logs = JSON.parse(localStorage.getItem('auth_debug_logs') || '[]');
  logs.push({
    time: new Date().toISOString(),
    message,
    data: data ?? null
  });
  localStorage.setItem('auth_debug_logs', JSON.stringify(logs));
};
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const handled = useRef(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  saveLog('Full URL vinhff 123');
  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    try {
      saveLog('Full URL', window.location.href);
      saveLog('Search part', window.location.search);
      saveLog('Hash part', window.location.hash);

      let params = new URLSearchParams(window.location.search);
      let accessToken = params.get('accessToken');
      let refreshToken = params.get('refreshToken');
      let role = params.get('role');
      let error = params.get('error');

      if (!accessToken || !refreshToken) {
        const hash = window.location.hash;
        if (hash) {
          const searchPart = hash.includes('?') ? hash.split('?')[1] : hash.substring(1);
          const hashParams = new URLSearchParams(searchPart);
          accessToken = accessToken || hashParams.get('accessToken');
          refreshToken = refreshToken || hashParams.get('refreshToken');
          role = role || hashParams.get('role');
          error = error || hashParams.get('error');
        }
      }

      saveLog('Parsed values', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        role,
        error
      });

      if (error) throw new Error(`Authentication error from server: ${error}`);
      if (!accessToken || !refreshToken) throw new Error('Token missing in URL');

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role ?? '');
      saveLog('localStorage saved', {
        accessToken: localStorage.getItem('accessToken')?.slice(0, 20) + '...',
        refreshToken: localStorage.getItem('refreshToken')?.slice(0, 20) + '...',
      });

      setToken(accessToken, refreshToken, role ?? '');
      saveLog('setToken called');

      const redirectPath = role === 'ADMIN' ? '/admin/profile' : '/';
      saveLog('Navigating to', redirectPath);
      navigate(redirectPath, { replace: true });

    } catch (err: any) {
      saveLog('ERROR', err?.message || String(err));
      setErrorText(err?.message || String(err));
    }
  }, [navigate, setToken]);

  if (errorText) {
    return (
      <div style={{
        padding: '30px',
        maxWidth: '600px',
        margin: '50px auto',
        backgroundColor: '#fff1f0',
        border: '1px solid #ffa39e',
        borderRadius: '8px',
        color: '#cf1322',
        fontFamily: 'sans-serif'
      }}>
        <h3 style={{ marginTop: 0 }}>Gặp lỗi khi xử lý đăng nhập (Auth Error)</h3>
        <p style={{ wordBreak: 'break-all', backgroundColor: '#fff', padding: '12px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
          {errorText}
        </p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => navigate('/', { replace: true })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Về Trang Chủ
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              color: '#000',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Thử Lại (Reload)
          </button>
        </div>
      </div>
    );
  }

  return <div><LoadingSpinner /></div>;
};

export default AuthCallbackPage;