import { FC, useEffect, useState } from "react"
import { useAuth } from "../../../hooks/useAuth";
import { useRecoilState } from "recoil";
import { authState } from "../../../recoil/AuthState";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../../../hooks/checkToken";
import Loading from "../../../components/loading/Loading";
import UserInfo from "../../../components/Sidebar/menu/users/UserInfo";

const UserInfoPage: FC<{ roles: string[] }> = ({ roles }) => {
  const SESSION_DURATION = 60 * 60 * 1000; // 1h
  
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthorization = async () => {
    const res = useAuth(auth, roles);
    if (!res.isLogin || !sessionStorage.getItem('expiresAt')) {
      alert('로그인 후 이용하세요');
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('expiresAt');
      navigate('/auth/signin');
    } else if (!res.isAuthorized) {
      navigate('/');
    } else if (res.isExpires) {
      alert('토큰이 만료되었습니다');
      const resCheck = await checkToken(setAuth);
      if(resCheck) {
        sessionStorage.setItem('expiresAt', JSON.stringify(Date.now() + SESSION_DURATION));
        navigate('/');
      } else {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('expiresAt');
        navigate('/auth/signin');
        return;
      }
    }

    setIsLoading(false);
  };
  
  useEffect(() => {
    checkAuthorization();
  }, []);

  if (isLoading) return <Loading />;
  
  return (
    <div className="bg-slate-100 p-2 h-screen">
      <UserInfo />
    </div>
  )
}

export default UserInfoPage
