import { FC, ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../recoil/AuthState";
import { Navigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const CACHE_DURATION = 600000; // 10분 유효성 캐싱

const ProtectedRoute: FC<{ children: ReactNode, requiredRoles?: string[] }> = ({ children, requiredRoles }) => {
  const [auth, setAuth] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  useEffect(() => {
    // 세션 스토리지에서 만료 시간을 가져옴
    const expAt = sessionStorage.getItem('expiresAt');
    if (expAt) {
      setExpiresAt(Number(expAt));
    }

    const checkToken = async () => {
      // 만료 시간이 유효할 경우 검증 생략
      if (auth.isAuthenticated && expiresAt && Date.now() < expiresAt) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-token', { withCredentials: true });
        if (response.status === 200) {
          setAuth({ isAuthenticated: true, role: response.data.role });
          // 만료 시간을 세션 스토리지에 저장
          const newExpiresAt = Date.now() + CACHE_DURATION;
          setExpiresAt(newExpiresAt);
          sessionStorage.setItem('expiresAt', JSON.stringify(newExpiresAt));
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          try {
            const refreshResponse = await axios.post('http://localhost:3000/api/auth/refresh', {}, { withCredentials: true });
            if (refreshResponse.status === 200) {
              setAuth({ isAuthenticated: true, role: refreshResponse.data.role });
              const newExpiresAt = Date.now() + CACHE_DURATION;
              setExpiresAt(newExpiresAt);
              sessionStorage.setItem('expiresAt', JSON.stringify(newExpiresAt));
            } else {
              setAuth({ isAuthenticated: false, role: null });
              setExpiresAt(null);
              sessionStorage.removeItem('expiresAt'); // 만료 시간 삭제
            }
          } catch (refreshError) {
            setAuth({ isAuthenticated: false, role: null });
            setExpiresAt(null);
            sessionStorage.removeItem('expiresAt'); // 만료 시간 삭제
          }
        } else {
          setAuth({ isAuthenticated: false, role: null });
          setExpiresAt(null);
          sessionStorage.removeItem('expiresAt'); // 만료 시간 삭제
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [setAuth, expiresAt]);

  if (isLoading) {
    return;
  }

  if (auth.isAuthenticated) {
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
