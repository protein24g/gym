import { FC, ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../recoil/AuthState";
import { Navigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const ProtectedRoute: FC<{ children: ReactNode, requiredRoles?: string[] }> = ({ children, requiredRoles }) => {
  const [auth, setAuth] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      if (auth.isAuthenticated) {
        setIsLoading(false);
        return;
      }

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
            } else {
              setAuth({ isAuthenticated: false, role: null });
            }
          } catch (refreshError) {
            setAuth({ isAuthenticated: false, role: null });
          }
        } else {
          setAuth({ isAuthenticated: false, role: null });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [setAuth]);

  if (isLoading) {
    return;
  }

  if (auth.isAuthenticated && !isLoading) {
    if (auth.role && requiredRoles && !requiredRoles.includes(auth.role)) {
      alert('권한이 없습니다');
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  alert('로그인 후 이용하세요');
  return <Navigate to="/auth/signin" replace />;
};

export default ProtectedRoute;
