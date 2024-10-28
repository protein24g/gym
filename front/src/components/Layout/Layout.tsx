import { FC } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../sidebar/Sidebar"
import Header from "../header/Header"

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
