import { ReactNode } from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";

export interface UsersMenuType {
  roles: string[],
  key: string,
  name: string, 
  path: string, 
  icon: ReactNode,
}

export const UsersMenus: UsersMenuType[] = [
  {
    roles: ['ROLES_OWNER'],
    key: 'managers',
    name: '점장', 
    path: '/managers', 
    icon: <MdOutlineSpaceDashboard className="w-8 h-8"/>,
  },
  {
    roles: ['ROLES_OWNER', 'ROLES_MANAGER'], 
    key: 'trainers', 
    name: '트레이너', 
    path: '/trainers', 
    icon: <MdOutlineSpaceDashboard className="w-8 h-8"/>,
  },
  {
    roles: ['ROLES_OWNER', 'ROLES_MANAGER', 'ROLES_TRAINER'], 
    key: 'users', 
    name: '회원', 
    path: '/users', 
    icon: <MdOutlineSpaceDashboard className="w-8 h-8"/>,
  },
]