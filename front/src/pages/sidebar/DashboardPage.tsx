import { FC } from "react"
import Box from "../../components/ui/Box"
import { FaCheck, FaUsers } from "react-icons/fa"
import { PiNetwork } from "react-icons/pi"
import { RiUserSettingsLine } from "react-icons/ri"

const DashboardPage: FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-white">
      <Box icon={<PiNetwork className="w-12 h-12 p-2 bg-gray-500 rounded-full"/>} num={'1,326'} describe={'지점'}/>
      <Box icon={<FaUsers className="w-12 h-12 p-2 bg-blue-500 rounded-full"/>} num={'326'} describe={'전체 회원'}/>
      <Box icon={<RiUserSettingsLine className="w-12 h-12 p-2 bg-blue-500 rounded-full"/>} num={'7'} describe={'트레이너'}/>
      <Box icon={<FaCheck className="w-12 h-12 p-2 bg-green-500 rounded-full"/>} num={'66'} describe={'출석'}/>
    </div>
  )
}

export default DashboardPage
