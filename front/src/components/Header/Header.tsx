import { FC, useContext, useEffect, useState } from "react"
import { RxHamburgerMenu } from "react-icons/rx"
import { SidebarContext } from "../../context/SidebarContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";

interface ProfileInfo {
  name: string;
  profileImageUrl: string | null;
}

const Header: FC<{isUser: boolean}> = ({isUser}) => {
  const navigate = useNavigate();
  const { toggleSidebar } = useContext(SidebarContext);
  const [profile, setProfile] = useState<ProfileInfo>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getMyProfileImage = async () => {
    const response = await axios.get('http://localhost:3000/api/mypage/profile', {
      withCredentials: true,
    });

    if (response.status === 200) {
      setProfile(response.data);
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
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('expiresAt');
      alert('로그아웃 실패: ' + error);
      navigate('/auth/signin');
    }
  };

  useEffect(() => {
    getMyProfileImage();
  }, []);

  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center border-b-2 border-gray-300 text-sm">
      <div className="flex flex-1 items-center py-4">
        <RxHamburgerMenu className="cursor-pointer mr-4 w-6 h-6 my-2" onClick={toggleSidebar} />
        <div className="cursor-pointer lg:hidden" onClick={() => {navigate('/')}}>
          {isUser ?
          ''
          :
          <Logo />
          }
        </div>
      </div>
      <span className="font-bold">{profile?.name}</span>
      <span className="mr-4">님 어서오세요.</span>
      <div onClick={() => {setIsDropdownOpen(!isDropdownOpen)}}>
        <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-300">
          {profile?.profileImageUrl ?
            <img src={profile.profileImageUrl} alt="Profile" className="w-full h-full" />
            :
            <svg className="absolute w-12 h-12 text-gray-200 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
          }
        </div>
      </div>
      {isDropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(!isDropdownOpen)}></div>
          <ul className="absolute w-40 top-14 right-0 z-50 bg-custom-gray text-white rounded-lg">
            <li className="hover:bg-gray-400 rounded-lg">
              <Link to={'my-page'} className="block p-3">
                <span className="">마이페이지</span>
              </Link>
            </li>
            <li className="p-3 hover:bg-gray-400 rounded-lg" onClick={logout}>로그아웃</li>
          </ul>
        </>
      )}
    </div>
  )
}

export default Header
