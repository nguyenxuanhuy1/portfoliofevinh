import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../../store/authStore';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';

/**
 * Trang Tiếp Nhận Callback Xác Thực (AuthCallbackPage)
 * 
 * ĐỊA CHỈ: `/auth/callback`
 * VAI TRÒ: Đây là trạm trung chuyển (landing page) tạm thời sau khi người dùng xác thực thành công qua Google.
 *          Nó có nhiệm vụ trích xuất Token từ URL, lưu vào kho dữ liệu và điều hướng người dùng đi tiếp.
 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  
  // Lấy hàm setToken từ Zustand store để lưu trữ Token toàn cục
  const { setToken } = useAuthStore();
  
  // useRef giúp đảm bảo useEffect chỉ chạy DUY NHẤT một lần (ngăn React StrictMode chạy 2 lần trong môi trường Dev)
  const handled = useRef(false);
  
  // State quản lý thông báo lỗi nếu xảy ra vấn đề trong quá trình trích xuất JWT
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    // Nếu đã xử lý rồi thì thoát ra luôn để tránh xung đột ghi đè token
    if (handled.current) return;
    handled.current = true;

    try {
      console.log('[Google AuthCallback] Đang phân tích thông tin trả về từ Server...');
      console.log('[Google AuthCallback] URL hiện tại:', window.location.href);

      // =========================================================================
      // BƯỚC 1: TRÍCH XUẤT TOKEN TỪ URL (Hỗ trợ cả Query string và Hash URL)
      // =========================================================================
      
      // 1. Thử trích xuất từ Query Parameters (Dạng: ?accessToken=xxx&refreshToken=yyy&role=zzz)
      let params = new URLSearchParams(window.location.search);
      let accessToken = params.get('accessToken');
      let refreshToken = params.get('refreshToken');
      let role = params.get('role');
      let error = params.get('error');

      // 2. Thử trích xuất từ Hash (Phòng hờ trường hợp dùng HashRouter hoặc cấu hình hash ở backend)
      // (Dạng: #/auth/callback?accessToken=xxx...)
      if (!accessToken || !refreshToken) {
        const hash = window.location.hash;
        if (hash) {
          // Lấy phần query sau dấu chấm hỏi (?) trong chuỗi hash
          const searchPart = hash.includes('?') ? hash.split('?')[1] : hash.substring(1);
          const hashParams = new URLSearchParams(searchPart);
          
          accessToken = accessToken || hashParams.get('accessToken');
          refreshToken = refreshToken || hashParams.get('refreshToken');
          role = role || hashParams.get('role');
          error = error || hashParams.get('error');
        }
      }

      console.log('[Google AuthCallback] Kết quả phân tích:', {
        cungCapAccessToken: !!accessToken,
        cungCapRefreshToken: !!refreshToken,
        vaiTroNguoiDung: role,
        maLoiTuServer: error
      });

      // =========================================================================
      // BƯỚC 2: XỬ LÝ LỖI (NẾU CÓ) TỪ MÁY CHỦ
      // =========================================================================
      if (error) {
        throw new Error(`Máy chủ xác thực báo lỗi: ${error}`);
      }

      // Nếu không có lỗi nhưng URL lại thiếu Token -> Có lỗi logic ở Backend
      if (!accessToken || !refreshToken) {
        throw new Error('Không tìm thấy Access Token hoặc Refresh Token trong URL phản hồi từ máy chủ.');
      }

      // =========================================================================
      // BƯỚC 3: LƯU TRỮ VÀ THIẾT LẬP TRẠNG THÁI ĐĂNG NHẬP
      // =========================================================================
      console.log('[Google AuthCallback] Đang lưu trữ token vào hệ thống...');
      
      // 1. Lưu thủ công vào LocalStorage để các thư viện khác hoặc các tab khác có thể sử dụng trực tiếp
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role ?? 'USER'); // Mặc định là USER nếu trống

      // 2. Lưu vào Zustand Auth Store để cập nhật state phản ứng (reactive state) trong React
      // (Zustand persist cũng tự động ghi đè vào key 'auth-storage' trong localStorage)
      setToken(accessToken, refreshToken, role ?? 'USER');
      console.log('[Google AuthCallback] Thiết lập trạng thái xác thực thành công!');

      // =========================================================================
      // BƯỚC 4: ĐIỀU HƯỚNG VỀ TRANG CHỨC NĂNG PHÙ HỢP
      // =========================================================================
      // - Nếu tài khoản có vai trò Quản trị viên (ADMIN) -> Dẫn thẳng tới trang hồ sơ admin (/admin/profile).
      // - Nếu là người dùng thường hoặc vai trò khác -> Dẫn về trang chủ (/).
      const redirectPath = role === 'ADMIN' ? '/admin/profile' : '/';
      console.log('[Google AuthCallback] Chuyển hướng người dùng tới:', redirectPath);
      
      // Dùng replace: true để đè đè history cũ, ngăn người dùng bấm "Back" trên trình duyệt quay lại trang callback này.
      navigate(redirectPath, { replace: true });

    } catch (err: any) {
      console.error('[Google AuthCallback Error] Lỗi xử lý callback đăng nhập Google:', err);
      setErrorText(err?.message || String(err));
    }
  }, [navigate, setToken]);

  // =========================================================================
  // GIAO DIỆN KHI CÓ LỖI XẢY RA (Giao diện Fallback khi lỗi Token)
  // =========================================================================
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

  // Giao diện chờ: Hiện vòng xoay loading trong lúc trích xuất token và điều hướng
  return <div><LoadingSpinner /></div>;
};

export default AuthCallbackPage;
