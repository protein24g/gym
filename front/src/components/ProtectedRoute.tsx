import { FC, ReactNode, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../recoil/AuthState";
import { Navigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";

const ProtectedRoute: FC<{ children: ReactNode, requiredRoles?: string[] }> = ({ children, requiredRoles }) => {
  const [auth, setAuth] = useRecoilState(authState);

  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-token', { withCredentials: true });
        if (response.status === 200) {
          setAuth({ isAuthenticated: true, role: response.data.role });
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          try {
            const refreshResponse = await axios.post('http://localhost:3000/api/auth/refresh', {}, { withCredentials: true });
            if (refreshResponse.status === 200) {
              setAuth({ isAuthenticated: true, role: refreshResponse.data.role });
            }
          } catch (refreshError) {
            setAuth({ isAuthenticated: false, role: null });
          }
        } else {
          setAuth({ isAuthenticated: false, role: null });
        }
      }
    };
    checkToken();
  }, [pathname]);

  if (!auth.isAuthenticated) {
    alert('로그인 후 이용하세요');
    return <Navigate to="/auth/signin" replace />;
  } else if (auth.role && requiredRoles && !requiredRoles.includes(auth.role)) {
    alert('권한이 없습니다');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // 인증된 경우 자식 컴포넌트 렌더링
};

export default ProtectedRoute;
