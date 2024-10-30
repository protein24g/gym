import { FC, ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../recoil/AuthState";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute: FC<{ children: ReactNode; requiredRoles?: string[] }> = ({ children, requiredRoles }) => {
  const [auth, setAuth] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-token', {
          withCredentials: true
        });
        if (response.status === 200) {
          setAuth({ isAuthenticated: true, role: response.data.role });
        }
      } catch (error) {
        setAuth({ isAuthenticated: false, role: null });
      } finally {
        setIsLoading(false); // 요청 완료 후 로딩 상태 해제
      }
    };
    
    checkToken(); // useEffect 내에서 비동기 함수 호출
  }, [setAuth]);

  if (isLoading) {
    return; // 로딩 중일 때 표시할 내용
  }

  if (!auth.isAuthenticated) {
    alert('로그인 후 이용하세요');
    return <Navigate to="/auth/signin" replace />; // 인증되지 않은 경우 리다이렉트
  }

  if (auth.role && requiredRoles && !requiredRoles.includes(auth.role)) {
    alert('권한이 없습니다');
    return <Navigate to="/" replace />; // 권한이 없는 경우 대시보드로 리다이렉트
  }

  return <>{children}</>; // 인증된 경우 자식 컴포넌트 렌더링
}

export default ProtectedRoute;
