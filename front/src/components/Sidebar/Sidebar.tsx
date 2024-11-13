import { FC, useContext, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { useRecoilValue } from "recoil";
import { SidebarContext } from "../../context/SidebarContext";
import { authState } from "../../recoil/AuthState";
import { SidebarMenus, SideBarMenuType } from "./menu/SidebarMenus";
import { UsersMenuType } from "./menu/users/UserMenus";
import axios, { AxiosError } from "axios";

interface SideProfileInfo {
  name: string;
  role: string;
  branchName: string;
  profileImageUrl?: string | null;
}

const Sidebar: FC<{isUser: boolean}> = ({isUser}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {isSidebarOpen, toggleSidebar} = useContext(SidebarContext);
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  const [sideProfile, setSideProfile] = useState<SideProfileInfo>();
  const navigate = useNavigate();

  const auth = useRecoilValue(authState);

  const location = useLocation(); // useLocation 훅 사용
  const { pathname } = location; // pathname 속성 추출

  useEffect(() => {
    getSideProfile();
  }, [])

  const SidebarLink = (menu: SideBarMenuType) => {
    if (menu.path) {
      return (
        <Link to={menu.path} className={`flex items-center p-2 transition-bg duration-500 hover:bg-gray-400 ${pathname === menu.path ? 'bg-gray-500' : ''}`} key={menu.key}>
          <span className="text-xl">{menu.icon}</span>
          <span className="ml-2">{menu.name}</span>
        </Link>
      );    
    } else {
      return (
        <div className="flex items-center justify-between p-2 hover:bg-gray-400" onClick={() => toggleDropdown(menu.key)}>
          <div className="flex items-center">
            <span className="text-xl">{menu.icon}</span>
            <span className="ml-2">{menu.name}</span>
          </div>
          {openMenus.has(menu.key) ? <GoTriangleUp/> : <GoTriangleDown/>}
        </div>
      )
    }
  };

  const getSideProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/mypage/side-profile', {withCredentials: true});

      console.log(response);
      if (response.status === 200) {
        setSideProfile(response.data);
      }
      
      setIsLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError.message);
      navigate('/auth/signin');
    }
  }

  const DropdownLink = (menu: UsersMenuType) => {
    return (
      <Link to={menu.path} className={`flex items-center p-2 pl-10 transition-bg duration-500 hover:bg-gray-400 ${pathname === menu.path ? 'bg-gray-500' : ''}`}>
        <span>{menu.name}</span>
      </Link>
    )
  }
  
  const toggleDropdown = (key: string) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  if (isLoading) return;

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:relative" onClick={toggleSidebar}></div>
      )}
      <div className={`w-64 h-screen bg-custom-gray text-white ${isSidebarOpen ? 'fixed z-50 lg:relative' : 'hidden'}`}>
        <div className="flex flex-col h-full justify-between">
          {sideProfile && (
            <div className="m-4 p-4 bg-gray-500 text-sm rounded-xl text-center">
              {isUser || !sideProfile.profileImageUrl ? 
              <svg className="w-24 h-24 rounded-full bg-gray-400 text-gray-300 mx-auto" fill="currentColor" viewBox="2 2 16 14" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
              :
              <img src={`${sideProfile.profileImageUrl}`} className="w-24 h-24 object-cover mx-auto rounded-full"></img>
              }
              <div className="mt-4 flex items-center justify-center">
                <p className="text-lg text-center font-bold">{sideProfile.name}</p>
                <p>({sideProfile.role.split('_')[1]})</p>
              </div>
              <p>{(sideProfile.branchName)}</p>
            </div>
          )}
          <hr className="border-gray-500"></hr>
          <div className="flex-1 p-4">
            <ul>
              {SidebarMenus.map((menu) => (
                auth.role && menu.roles && menu.roles.includes(auth.role) && (
                  <li key={menu.key}>
                    {SidebarLink(menu)}
                    {menu.children && (
                      openMenus.has(menu.key) && (
                        <ul className={`${pathname === menu.path ? 'bg-gray-500' : ''}`}>
                          {menu.children.map((children) =>
                            (auth.role && children.roles.includes(auth.role) && (
                              <li key={children.key} className="w-full">
                                {DropdownLink(children)}
                              </li>
                            ))
                          )}
                        </ul>
                      )
                    )}
                  </li>
                )
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar
