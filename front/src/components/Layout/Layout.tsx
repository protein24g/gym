import { FC } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../Sidebar/Sidebar"
import Header from "../Header/Header"

const Layout: FC = () => {
  return (
    <div className="flex bg-slate-100 h-screen">
      <Sidebar/>
      <div className="flex flex-1 flex-col">
        <Header/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
