import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../../store/authStore';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const handled = useRef(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    try {
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

      if (error) {
        throw new Error(`Máy chủ xác thực báo lỗi: ${error}`);
      }

      if (!accessToken || !refreshToken) {
        throw new Error('Không tìm thấy Access Token hoặc Refresh Token trong URL phản hồi từ máy chủ.');
      }

      setToken(accessToken, refreshToken, role ?? 'USER');

      const redirectPath = role === 'ADMIN' ? '/admin/profile' : '/';
      navigate(redirectPath, { replace: true });

    } catch (err: any) {
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
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h3 style={{ marginTop: 0 }}>Gặp lỗi khi xử lý đăng nhập Google</h3>
        <p style={{ 
          wordBreak: 'break-all', 
          backgroundColor: '#fff', 
          padding: '12px', 
          border: '1px solid #d9d9d9', 
          borderRadius: '4px',
          fontSize: '14px',
          color: '#434343'
        }}>
          Chi tiết lỗi: {errorText}
        </p>
        <div style={{ marginTop: '20px' }}>
          <Button 
            onClick={() => navigate('/', { replace: true })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
              fontWeight: 500
            }}
          >
            Quay về Trang Chủ
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              color: '#000',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Thử Lại (Reload)
          </Button>
        </div>
      </div>
    );
  }

  return <div><LoadingSpinner /></div>;
};

export default AuthCallbackPage;
