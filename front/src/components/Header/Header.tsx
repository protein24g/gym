import { FC } from "react"

const Header: FC = () => {
  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center">
      <div className="relative">
        <input type="text" placeholder="Search..." className="text-sm focus:outline-none w-full xl:w-[24rem] h-10 border border-gray-400 rounded-sm px-4"></input>
      </div>
      <div>side buttons</div>
    </div>
  )
}

export default Header
