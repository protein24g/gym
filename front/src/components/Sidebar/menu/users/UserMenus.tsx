export interface UsersMenuType {
  roles: string[],
  key: string,
  name: string, 
  path: string, 
}

export const UsersMenus: UsersMenuType[] = [
  {
    roles: ['ROLES_OWNER', 'ROLES_MANAGER'], 
    key: 'trainers', 
    name: '트레이너 관리', 
    path: '/trainers', 
  },
  {
    roles: ['ROLES_OWNER', 'ROLES_MANAGER', 'ROLES_TRAINER'], 
    key: 'users', 
    name: '회원 관리', 
    path: '/users', 
  },
  {
    roles: ['ROLES_TRAINER'], 
    key: 'students', 
    name: '수강생 관리', 
    path: '/students', 
  },
]