import { FC } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../Sidebar/Sidebar"
import Header from "../Header/Header"

const Layout: FC<{isSidebarOpen: boolean, toggleSidebar: () => void}> = ({isSidebarOpen, toggleSidebar}) => {
  return (
    <div className="flex bg-slate-100 h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className="flex flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar}/>
        <Outlet/>  
      </div>
    </div>
  )
}

export default Layout
