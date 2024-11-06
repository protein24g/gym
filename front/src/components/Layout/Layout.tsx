import { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { checkToken } from '../../hooks/checkToken';
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/AuthState';

const Layout: FC<{ roles: string[] }> = ({ roles }) => {
  const SESSION_DURATION = 60 * 60 * 1000; // 1h

  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
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

    checkAuthorization();
  }, [auth, navigate, location.search]);

  if (isLoading) {
    return;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar isUser={roles.includes('ROLES_USER')} />
      <div className="flex flex-1 flex-col overflow-auto">
        <Header isUser={roles.includes('ROLES_USER')}/>
        <div className="overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
