import { FC } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../sidebar/Sidebar"
import Header from "../header/Header"

const Layout: FC<{imageSrc: string | undefined}> = ({imageSrc}) => {
  return (
    <div className="flex bg-slate-100 h-screen">
      <Sidebar/>
      <div className="flex flex-1 flex-col">
        <Header imageSrc={imageSrc}/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
