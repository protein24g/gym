import { createContext } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isSidebarOpen: true, // 기본값 설정
  toggleSidebar: () => {}, // 기본 함수 설정
});
