import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { AppRoute } from '../types/Layout';

type Props = {
  route: AppRoute;
  children: React.ReactNode;
};

/**
 * RouteGuard (Bộ bảo vệ định tuyến)
 * 
 * Thành phần chịu trách nhiệm kiểm tra quyền truy cập của người dùng trước khi hiển thị nội dung trang.
 * Giúp ngăn chặn người dùng thường truy cập trái phép vào trang quản trị (Admin Area) 
 * hoặc bắt buộc đăng nhập đối với các tài nguyên riêng tư.
 */
export function RouteGuard({ route, children }: Props) {
  // Lấy trạng thái xác thực hiện tại từ Zustand store
  const token = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.role);

  // =========================================================================
  // TRƯỜNG HỢP 1: Tuyến đường công khai (Public Route)
  // =========================================================================
  // - Nếu route được đánh dấu là `public: true` (ví dụ: Trang chủ /, Trang dự án /projects, Trang Đăng nhập /auth)
  // - Chúng ta cho phép TẤT CẢ mọi người truy cập trực tiếp mà không cần check token hay vai trò.
  // 
  // * LƯU Ý ĐẶC BIỆT VỀ ĐĂNG NHẬP BẰNG GOOGLE (OAuth/SSO):
  // - Route `/auth/callback` bắt buộc PHẢI là route public (`public: true` trong routeConfig.tsx).
  // - LÝ DO: Khi người dùng đăng nhập bằng Google thành công, máy chủ Google/Backend sẽ chuyển hướng (redirect)
  //   về `/auth/callback?accessToken=...`. Lúc này trên trình duyệt của người dùng CHƯA hề có token trong state.
  // - Nếu route `/auth/callback` bị cấu hình là private (`public: false`), RouteGuard sẽ chặn lại ngay lập tức
  //   tại bước kiểm tra token bên dưới và đá người dùng về `/auth`, gây ra lỗi vòng lặp chuyển hướng vô hạn (Infinite Redirect Loop)
  //   và không bao giờ lưu được Token Google vào bộ nhớ!
  if (route.public) {
    return <>{children}</>;
  }

  // =========================================================================
  // TRƯỜNG HỢP 2: Người dùng chưa đăng nhập (Thiếu Access Token)
  // =========================================================================
  // - Route yêu cầu bảo mật (private) nhưng trong bộ nhớ `authStore` không tìm thấy `accessToken`.
  // - Hành động: Chuyển hướng người dùng về trang đăng nhập `/auth`.
  // - Sử dụng `replace` để tránh ghi lại lịch sử duyệt web lỗi này vào ngăn xếp History của trình duyệt.
  // 
  // * ĐIỂM CẦN LƯU Ý KHI ĐĂNG NHẬP BẰNG GOOGLE (OAuth/SSO):
  // - Sau khi người dùng đăng nhập bằng Google thành công, dữ liệu token đã được lưu vào localStorage
  //   và Zustand Store tại trang `/auth/callback`. Nhờ đó, ở các lần truy cập tiếp theo vào trang Admin, 
  //   biến `token` sẽ có giá trị và bypass qua được điều kiện kiểm tra này một cách an toàn.
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // =========================================================================
  // TRƯỜNG HỢP 3: Sai quyền hạn/vai trò (Role Restriction)
  // =========================================================================
  // - Người dùng đã đăng nhập (có token) nhưng vai trò lưu trong store không phải là quản trị viên (`ADMIN`).
  // - Ví dụ: Tài khoản người dùng thường (`USER`) cố tình gõ URL `/admin/profile` trên thanh địa chỉ.
  // - Hành động: Chặn quyền truy cập và chuyển hướng an toàn về Trang chủ `/`.
  // 
  // * LƯU Ý VỀ KHẢ NĂNG GÂY LỖI TRONG PRODUCTION (Cần chú ý):
  // - 1. Sai lệch đồng bộ: Nếu giá trị `role` trong local storage hoặc cookie bị sửa đổi trái phép ở client,
  //      RouteGuard có thể bị vượt qua ở phía client. TUY NHIÊN, điều này vô hại vì tất cả các cuộc gọi API 
  //      lên Backend của Admin đều được xác thực và phân quyền nghiêm ngặt bằng JWT ở phía Server.
  // - 2. Đăng ký tài khoản mới qua Google: Khi user đăng nhập bằng Google lần đầu, vai trò mặc định của họ là gì?
  //      Cần đảm bảo backend định cấu hình đúng vai trò mặc định (ví dụ: 'USER') để tránh việc tài khoản thường 
  //      đột nhập vào giao diện Admin.
  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // =========================================================================
  // TRƯỜNG HỢP 4: Hợp lệ tuyệt đối (Authorized)
  // =========================================================================
  // - Thỏa mãn tất cả các điều kiện: Đã đăng nhập + Vai trò chính xác là 'ADMIN'.
  // - Cho phép render và hiển thị nội dung các trang quản trị.
  return <>{children}</>;
}