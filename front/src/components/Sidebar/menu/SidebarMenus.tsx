import { MdOutlineSpaceDashboard } from "react-icons/md";
import { UsersMenus, UsersMenuType } from "./users/usersMenus";
import { ReactNode } from "react";

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
    path: '/dashboard',
    icon: <MdOutlineSpaceDashboard className="w-6 h-6"/>,
  },
  {
    key: 'memberManagement',
    name: '멤버 관리',
    icon: <MdOutlineSpaceDashboard className="w-6 h-6"/>,
    children: UsersMenus, // UsersMenus 배열을 하위 메뉴로 사용
  },
  {
    roles: ['ROLES_OWNER', 'ROLES_MANAGER', 'ROLES_TRAINER', 'ROLES_USER'],
    key: 'myPage',
    name: '마이페이지',
    path: '/my-page',
    icon: <MdOutlineSpaceDashboard className="w-6 h-6"/>,
  },
];
