import { atom } from 'recoil';

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
}

export const authState = atom<AuthState> ({
  key: 'authState',
  default: {
    isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated') || 'false'),
    role: JSON.parse(localStorage.getItem('role') || 'null')
  },
  effects: [
    ({onSet}) => {
      onSet((newState) => {
        localStorage.setItem('isAuthenticated',  JSON.stringify(newState.isAuthenticated));
        localStorage.setItem('role', JSON.stringify(newState.role));
      })
    }
  ]
})