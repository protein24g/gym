import { MdDashboard } from "react-icons/md";
import { ReactNode } from "react";
import { UsersMenus, UsersMenuType } from "./users/UserMenus";
import { FaUsers } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { BiBuildings } from "react-icons/bi";

export interface SideBarMenuType {
  roles?: string[],
  key: string,
  name: string,
  path?: string | undefined,
  icon: ReactNode,
  children?: UsersMenuType[],
}

export const SidebarMenus: SideBarMenuType[] = [
  {
    roles: ['ROLES_OWNER', 'ROLES_MANAGER', 'ROLES_TRAINER'],
    key: 'dashboard',
    name: '대시보드',
    path: '/',
    icon: <MdDashboard className="w-6 h-6"/>,
  },
  {
    roles: ['ROLES_USER'],
    key: 'dashboard',
    name: '메인',
    path: '/',
    icon: <MdDashboard className="w-6 h-6"/>,
  },
  {
    roles: ['ROLES_OWNER'],
    key: 'managers',
    name: '지점 관리', 
    path: '/managers', 
    icon: <BiBuildings className="w-6 h-6"/>,
  },
  {
    roles: ['ROLES_OWNER', 'ROLES_MANAGER', 'ROLES_TRAINER'],
    key: 'memberManagement',
    name: '멤버 관리',
    icon: <FaUsers className="w-6 h-6"/>,
    children: UsersMenus, // UsersMenus 배열을 하위 메뉴로 사용
  },
  {
    roles: ['ROLES_OWNER', 'ROLES_MANAGER', 'ROLES_TRAINER', 'ROLES_USER'],
    key: 'myPage',
    name: '마이페이지',
    path: '/my-page',
    icon: <ImProfile className="w-6 h-6"/>,
  },
];
