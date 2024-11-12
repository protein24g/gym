import { FC } from "react"

const Box: FC<{icon: React.ReactNode, count: number, describe: string}> = ({icon, count, describe}) => {
  return (
    <div className="flex bg-white">
      <div className="border-4 border-gray-400 bg-blue-500"></div>
      <div className="flex flex-1 justify-between items-center p-4">
        <div>
          <p className="text-gray-400 font-bold">{describe}</p>
          <p className="text-black text-2xl font-bold">{count}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  )
}

export default Box
