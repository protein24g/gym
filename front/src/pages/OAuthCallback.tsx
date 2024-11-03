import axios from "axios"
import { FC, useEffect } from "react"
import { useRecoilState } from "recoil"
import { authState } from "../recoil/AuthState"
import { useNavigate } from "react-router-dom"

const OAuthCallback: FC = () => {
  const SESSION_DURATION = 15 * 60 * 1000; // 15분

  const navigate = useNavigate();
  const [, setAuth] = useRecoilState(authState);

  useEffect(() => {
    const checkToken = async () => {
      const role = sessionStorage.getItem('role');
      if (role) navigate('/');

      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-token', {withCredentials: true});
        console.log(response);

        if (response.status === 200) {
          console.log('200');
          setAuth({isAuthenticated: true, role: response.data.role});
          sessionStorage.setItem('expiresAt', JSON.stringify(Date.now() + SESSION_DURATION));
          location.reload();
        }
      } catch(error) {
        alert('잘못된 토큰입니다');
        navigate('/auth/signin');
      }
    };

    checkToken();
  }, [setAuth])

  return (
    <>
    </>
  )
}

export default OAuthCallback
