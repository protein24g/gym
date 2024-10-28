import { FC, ReactNode } from "react"
import { useRecoilValue } from "recoil"
import { authState } from "../recoil/AuthState"
import { Navigate } from "react-router-dom";

const ProtectedRoute: FC<{children: ReactNode}> = ({children}) => {
  const auth = useRecoilValue(authState);

  if (!auth.isAuthenticated) {
    alert('로그인 후 이용하세요');
    return <Navigate to="/auth/signin" replace/>
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute
