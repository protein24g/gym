import { FC, useContext } from "react"
import { CiSearch } from "react-icons/ci"
import { RxHamburgerMenu } from "react-icons/rx"
import { SidebarContext } from "../../context/SidebarContext";

const Header: FC = () => {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center">
      <div className="flex flex-1 items-center">
        <RxHamburgerMenu className="cursor-pointer mr-4" onClick={toggleSidebar}/>
        <div className="relative w-full">
          <input type="text" placeholder="Search..." className="text-sm focus:outline-none w-3/4 md:w-2/5 h-10 border border-gray-400 rounded-sm px-4 pl-7"></input>
          <CiSearch className="absolute left-2 top-3"/>
        </div>
      </div>
      <div>side buttons</div>
    </div>
  )
}

export default Header
