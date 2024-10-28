import { atom } from 'recoil';

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
}

export const authState = atom<AuthState> ({
  key: 'authState',
  default: {isAuthenticated: false, role: null},
})