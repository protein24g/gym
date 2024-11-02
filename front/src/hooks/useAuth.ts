import { AuthState } from '../recoil/AuthState';

interface useAuthType {
  isLogin: boolean,
  isAuthorized: boolean,
  isExpires: boolean
}

export const useAuth = (auth: AuthState, roles: string[]): useAuthType => {
  if (auth.isAuthenticated) {
    if (auth.role && roles.includes(auth.role)) {
      const expires = sessionStorage.getItem('expiresAt');
      if (expires && Date.now() < JSON.parse(expires)) {
        return { isLogin: true, isAuthorized: true, isExpires: false}
      } else {
        return { isLogin: true, isAuthorized: true, isExpires: true }
      }
    } else {
      return { isLogin: true, isAuthorized: false, isExpires: true }
    }
  } else {
    return { isLogin: false, isAuthorized: false, isExpires: true }
  }
  
};
