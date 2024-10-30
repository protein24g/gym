import { FC, useContext, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { useRecoilValue } from "recoil";
import { SidebarContext } from "../../context/SidebarContext";
import { authState } from "../../recoil/AuthState";
import { SidebarMenus, SideBarMenuType } from "./menu/SidebarMenus";
import { UsersMenuType } from "./menu/users/UserMenus";
import Logo from "../Logo/Logo";

const Sidebar: FC = () => {
  const {isSidebarOpen, toggleSidebar} = useContext(SidebarContext);
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const auth = useRecoilValue(authState);

  const location = useLocation(); // useLocation 훅 사용
  const { pathname } = location; // pathname 속성 추출

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

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:relative" onClick={toggleSidebar}></div>
      )}
      <div className={`w-72 h-screen bg-custom-gray text-white ${isSidebarOpen ? 'fixed z-50 lg:relative' : 'hidden'}`}>
        <div className="flex flex-col h-full justify-between">
          <div className="p-6">
            <Logo />
          </div>
          <hr className="border-gray-500"></hr>
          <div className="flex-1 p-6">
            <ul>
              {SidebarMenus.map((menu) => (
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
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar
