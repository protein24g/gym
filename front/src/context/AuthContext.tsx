import { createContext } from "react";

interface AuthContextType {
  role: string | undefined;
  setRole: (role: string) => void; // role을 업데이트할 수 있는 함수 추가
}

export const AuthContext = createContext<AuthContextType>({
  role: undefined,
  setRole: () => {}, // 기본 함수 설정
});
