import { MdOutlineSpaceDashboard } from "react-icons/md";

export const SidebarMenus = [
  {roles: ['OWNER', 'MANAGER', 'TRAINER'], key: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: <MdOutlineSpaceDashboard/>},
  {roles: ['OWNER'], key: 'providers', name: 'Providers', path: '/providers', icon: <MdOutlineSpaceDashboard/>},
  {roles: ['OWNER', 'MANAGER'], key: 'trainers', name: 'Trainers', path: '/trainers', icon: <MdOutlineSpaceDashboard/>},
  {roles: ['OWNER', 'MANAGER', 'TRAINER'], key: 'users', name: 'Users', path: '/users', icon: <MdOutlineSpaceDashboard/>},
]