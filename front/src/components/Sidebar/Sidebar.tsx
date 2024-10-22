import { FC, ReactNode } from "react"
import { SidebarMenus } from "./SidebarMenus"
import { Link, useLocation } from "react-router-dom"
import { IoStatsChart } from "react-icons/io5";

interface MenuItem {
  roles: string[];
  key: string;
  name: string;
  path: string;
  icon: ReactNode;
}

const Sidebar: FC<{isSidebarOpen: boolean, toggleSidebar: () => void}> = ({isSidebarOpen, toggleSidebar}) => {
  const location = useLocation(); // useLocation 훅 사용
  const { pathname } = location; // pathname 속성 추출

  const SidebarLink = (menu: MenuItem) => {
    return (
      <Link to={menu.path} className={`flex items-center p-2 transition-bg duration-500 hover:bg-gray-500 ${pathname === menu.path ? 'bg-gray-500' : ''}`} key={menu.key}>
        <span className="text-xl">{menu.icon}</span>
        <span className="ml-2">{menu.name}</span>
      </Link>
    );
  };

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:relative" onClick={toggleSidebar}></div>
      )}
      <div className={`w-72 h-screen bg-custom-gray text-white ${isSidebarOpen ? 'fixed z-50 lg:relative' : 'hidden'}`}>
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center  gap-4 p-6">
            <span><IoStatsChart className="w-10 h-10 bg-white p-2 text-black rounded-lg"/></span>
            <span className="text-2xl">관리자 페이지</span>
          </div>
          <div className="flex-1 p-6">
            {SidebarMenus.map((menu) => SidebarLink(menu))}
          </div>
          <div className="p-6">bottom part</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar
