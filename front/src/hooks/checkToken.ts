import axios, { AxiosError } from "axios";
import { SetStateAction } from "react";
import { AuthState } from "../recoil/AuthState";

export const checkToken = async (setAuth: (value: SetStateAction<AuthState>) => void): Promise<boolean> => {
  const SESSION_DURATION = 15 * 60 * 1000; // 15분

  try {
    const response = await axios.get('http://localhost:3000/api/auth/check-token', { withCredentials: true });
    if (response.status === 200) {
      setAuth({ isAuthenticated: true, role: response.data.role });

      return true;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      try {
        const refreshResponse = await axios.post('http://localhost:3000/api/auth/refresh', {}, { withCredentials: true });
        if (refreshResponse.status === 201) {
          setAuth({ isAuthenticated: true, role: refreshResponse.data.role });
          sessionStorage.setItem('expiresAt', JSON.stringify(Date.now() + SESSION_DURATION));
  
          return true;
        }
      } catch (refreshError) {
      }
    }
  }
  setAuth({ isAuthenticated: false, role: null });
  sessionStorage.removeItem('isAuthrenticated');
  sessionStorage.removeItem('expiresAt');
  sessionStorage.removeItem('expiresAt');

  return false;
}