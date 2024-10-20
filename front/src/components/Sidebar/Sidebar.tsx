import { FC, ReactNode } from "react"
import { SidebarMenus } from "./SidebarMenus"
import { Link, useLocation } from "react-router-dom"

interface MenuItem {
  roles: string[];
  key: string;
  name: string;
  path: string;
  icon: ReactNode;
}

const Sidebar: FC = () => {
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
    <div className="flex flex-col w-60 p-3 bg-custom-gray text-white">
      <div className="flex flex-col border-b p-3 justify-center items-center">
        <a className="text-2xl">관리자 페이지</a>
        <a className="text-md">몸 좋아 GYM</a>
      </div>
      <div className="flex-1">
        {SidebarMenus.map((menu) => SidebarLink(menu))}
      </div>
      <div>bottom part</div>
    </div>
  );
};

export default Sidebar
