import { atom } from 'recoil';

export interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
}

export const authState = atom<AuthState> ({
  key: 'authState',
  default: {
    isAuthenticated: JSON.parse(sessionStorage.getItem('isAuthenticated') || 'false'),
    role: JSON.parse(sessionStorage.getItem('role') || 'null')
  },
  effects: [
    ({onSet}) => {
      onSet((newState) => {
        sessionStorage.setItem('isAuthenticated', JSON.stringify(newState.isAuthenticated));
        sessionStorage.setItem('role', JSON.stringify(newState.role));
      })
    }
  ]
})