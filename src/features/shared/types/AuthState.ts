export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  setToken: (accessToken: string, refreshToken: string, role: string) => void;
  logout: () => void;
}