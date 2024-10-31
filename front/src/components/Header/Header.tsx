import { FC, useContext, useEffect, useState } from "react"
import { RxHamburgerMenu } from "react-icons/rx"
import { SidebarContext } from "../../context/SidebarContext";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../../recoil/AuthState";
import Logo from "../Logo/Logo";

const Header: FC = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useContext(SidebarContext);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [, setAuth] = useRecoilState(authState);

  const getMyProfileImage = async () => {
    const response = await axios.get('http://localhost:3000/api/mypage/profile/image', {
      withCredentials: true,
    });

    if (response.status === 200) {
      setImageSrc(response.data);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signout', {}, { 
        withCredentials: true 
      });
      
      if (response.status === 200) {
        // 세션 스토리지에서 인증 관련 데이터 제거
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('expiresAt');
        alert('로그아웃 성공');
        navigate('/auth/signin'); // 로그인 페이지로 리디렉션
      }
    } catch (error) {
      alert('로그아웃 실패: ' + error);
      navigate('/auth/signin');
    }
  };

  useEffect(() => {
    getMyProfileImage();
  }, []);

  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center border-b-2 border-gray-300">
      <div className="flex flex-1 items-center">
        <RxHamburgerMenu className="cursor-pointer mr-4" onClick={toggleSidebar} />
        <div className="cursor-pointer" onClick={() => {navigate('/')}}>
          <Logo />
        </div>
      </div>
      <div className="group">
        {imageSrc ? <img src={imageSrc} alt="Profile" className="w-10 h-10 rounded-full" /> : <CgProfile className="w-10 h-10 rounded-full"/>}
        <ul className="absolute w-40 right-0 border bg-white hidden group-hover:block">
          <li className="p-3 hover:bg-gray-300">
            <Link to={'my-page'}>마이페이지</Link>
          </li>
          <hr></hr>
          <li className="p-3 hover:bg-gray-300" onClick={logout}>로그아웃</li>
        </ul>
      </div>
    </div>
  )
}

export default Header
