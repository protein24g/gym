import { FC } from "react"
import Box from "../../components/ui/Box"
import { FaCalendarCheck, FaUsers } from "react-icons/fa"
import { SiTrainerroad } from "react-icons/si"
import { MdCancel } from "react-icons/md"

const DashboardPage: FC = () => {
  return (
    <div className="m-4 p-4 text-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 2xl:gap-7.5 text-white">
        <Box icon={<FaUsers className="w-8 h-8"/>} num={'661'}/>
        <Box icon={<FaCalendarCheck className="w-8 h-8"/>} num={'34'}/>
        <Box icon={<SiTrainerroad  className="w-8 h-8"/>} num={'6'}/>
        <Box icon={<MdCancel className="w-8 h-8"/>} num={'16'}/>
      </div>
    </div>
  )
}

export default DashboardPage
