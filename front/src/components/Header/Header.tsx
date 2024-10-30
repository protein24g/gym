import { FC, useContext, useEffect, useState } from "react"
import { CiSearch } from "react-icons/ci"
import { RxHamburgerMenu } from "react-icons/rx"
import { SidebarContext } from "../../context/SidebarContext";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../../recoil/AuthState";

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
        setAuth({ isAuthenticated: false, role: null }); // 로그인 상태 초기화
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
        <div className="relative w-full">
          <input type="text" placeholder="Search..." className="text-sm focus:outline-none w-3/4 md:w-2/5 h-10 border border-gray-400 rounded-sm px-4 pl-7"></input>
          <CiSearch className="absolute left-2 top-3"/>
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

export default Header;
