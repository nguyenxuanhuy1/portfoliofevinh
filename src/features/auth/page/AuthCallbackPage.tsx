import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { LoadingSpinner } from '../../../components/ui/Loading/LoadingSpinner';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const handled = useRef(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    try {
      console.log('[AuthCallback] Full URL:', window.location.href);
      console.log('[AuthCallback] Search part:', window.location.search);
      console.log('[AuthCallback] Hash part:', window.location.hash);

      // 1. Try parsing from query string (window.location.search)
      let params = new URLSearchParams(window.location.search);
      let accessToken = params.get('accessToken');
      let refreshToken = params.get('refreshToken');
      let role = params.get('role');
      let error = params.get('error');

      // 2. If not found in search, try parsing from hash (window.location.hash)
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

      console.log('[AuthCallback] Parsed values:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        role,
        error
      });

      if (error) {
        throw new Error(`Authentication error from server: ${error}`);
      }

      if (!accessToken || !refreshToken) {
        throw new Error('Access token or refresh token is missing in the URL parameters.');
      }

      console.log('[AuthCallback] Saving tokens to localStorage and Zustand store...');
      // Set thủ công vào localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role ?? '');

      // Set vào Zustand (cũng tự động ghi vào localStorage under 'auth-storage')
      setToken(accessToken, refreshToken, role ?? '');
      console.log('[AuthCallback] Tokens successfully stored!');

      const redirectPath = role === 'ADMIN' ? '/admin/profile' : '/';
      console.log('[AuthCallback] Navigating to:', redirectPath);
      navigate(redirectPath, { replace: true });

    } catch (err: any) {
      console.error('[AuthCallback] Error during callback handling:', err);
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