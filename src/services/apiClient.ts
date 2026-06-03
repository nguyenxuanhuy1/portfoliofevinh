import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';
import { useAuthStore } from '../store/authStore';
import type { ApiResponse, ApiError } from '../features/shared/types/Api';

// =========================================================================
// QUẢN LÝ HÀNG ĐỢI LÀM MỚI TOKEN (Token Refresh Queue)
// =========================================================================
// Nhằm mục đích: Khi Access Token hết hạn, nếu có nhiều cuộc gọi API đồng thời (ví dụ: load profile, load skills cùng lúc),
// chúng ta chỉ gửi DUY NHẤT một yêu cầu ngầm làm mới token (Silent Refresh) lên Server.
// Các request lỗi 401 tiếp theo sẽ được lưu vào hàng đợi và đợi Token mới trả về để tự động thực thi lại.

let isRefreshing = false; // Cờ kiểm soát trạng thái đang làm mới Token
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

/**
 * Xử lý hàng đợi lỗi sau khi quá trình refresh kết thúc
 * @param error Lỗi phát sinh nếu refresh thất bại
 * @param token Token mới nếu refresh thành công
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

// =========================================================================
// 1. REQUEST INTERCEPTOR (Tự động đính kèm Token khi gửi API)
// =========================================================================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy Access Token mới nhất từ Zustand Store (hỗ trợ cả tài khoản thường và tài khoản liên kết Google)
    const accessToken = useAuthStore.getState().accessToken;

    // Nếu tồn tại Access Token, đính kèm vào header dưới dạng Bearer Token để Backend xác thực
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Tự động điều chỉnh Content-Type (ví dụ: upload tệp tin qua FormData thì để trình duyệt tự thiết lập)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================================================================
// 2. RESPONSE INTERCEPTOR (Tự động sửa lỗi 401 & Silent Refresh Token)
// =========================================================================
axiosInstance.interceptors.response.use(
  // Trường hợp thành công: Trích xuất trực tiếp dữ liệu từ payload `data.data` trả về từ máy chủ
  (response) => response.data.data,

  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Kiểm tra nếu Server phản hồi lỗi 401 (Unauthorized / Token hết hạn) và request chưa từng thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // A. Nếu có một API khác đã và đang thực hiện Refresh Token rồi
      if (isRefreshing) {
        // Đẩy request hiện tại vào hàng đợi và đợi tín hiệu hoàn tất
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newAccessToken) => {
          // Khi có token mới, đính kèm vào header và thực thi lại request ban đầu
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        });
      }

      // B. Bắt đầu luồng Refresh Token chính (Chỉ chạy một instance duy nhất)
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Lấy Refresh Token từ trạng thái ứng dụng (hoạt động đồng nhất cho cả Google SSO và Login truyền thống)
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('Không tìm thấy Refresh Token trong kho lưu trữ.');
        }

        console.log('[API Interceptor] Access Token hết hạn. Đang ngầm gửi yêu cầu Refresh Token...');
        
        // Gọi API Refresh Token lên máy chủ
        const response = await axios.get<ApiResponse<{ accessToken: string; refreshToken: string; role: string }>>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`, // Gửi Refresh Token làm mã định danh
            },
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken, role } = response.data.data;

        // Lưu cặp token mới và vai trò vào Zustand store & localStorage
        useAuthStore.getState().setToken(newAccessToken, newRefreshToken, role);
        
        // Giải phóng hàng đợi chờ đợi với token mới thành công
        processQueue(null, newAccessToken);

        console.log('[API Interceptor] Refresh Token thành công! Đang tự động gửi lại các API bị lỗi...');
        
        // Gắn token mới vào request hiện tại và chạy lại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Nếu quá trình Refresh Token ngầm bị thất bại (ví dụ: Refresh Token hết hạn, tài khoản bị khóa/xóa...)
        console.error('[API Interceptor] Quá trình Refresh Token ngầm thất bại. Buộc đăng xuất người dùng.');
        
        // Giải phóng hàng đợi với lỗi
        processQueue(refreshError, null);
        
        // Đăng xuất xóa sạch Token khỏi store & localStorage
        useAuthStore.getState().logout();
        
        // Trả lỗi về để UI chuyển hướng hoặc hiển thị thông báo yêu cầu đăng nhập lại
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    // Chuẩn hóa cấu trúc thông báo lỗi từ Server trả về
    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'Đã xảy ra lỗi không xác định',
      status: error.response?.status ?? 500,
      errors: undefined,
    };

    return Promise.reject(apiError);
  }
);

// =========================================================================
// 3. API CLIENT WRAPPER (Các phương thức gọi API tiện ích)
// =========================================================================
const apiClient = {
  get: <T>(url: string, params?: object): Promise<T> =>
    axiosInstance.get(url, { params }),

  post: <T>(url: string, body?: unknown): Promise<T> =>
    axiosInstance.post(url, body),

  put: <T>(url: string, body?: unknown): Promise<T> =>
    axiosInstance.put(url, body),

  patch: <T>(url: string, body?: unknown): Promise<T> =>
    axiosInstance.patch(url, body),

  delete: <T>(url: string): Promise<T> =>
    axiosInstance.delete(url),
};

export default apiClient;