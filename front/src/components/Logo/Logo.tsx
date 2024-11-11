import { FC } from "react"
import { IoStatsChart } from "react-icons/io5"

const Logo: FC = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <span><IoStatsChart className="w-8 h-8 bg-gray-300 p-2 text-black rounded-lg"/></span>
      <span className="hidden md:block text-2xl">관리자 페이지</span>
    </div>
  )
}

export default Logo
