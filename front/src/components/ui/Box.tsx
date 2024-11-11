import { FC } from "react"

const Box: FC<{icon: React.ReactNode, count: number, describe: string}> = ({icon, count, describe}) => {
  return (
    <div className="flex h-24 bg-white border-2">
      <div className="border-2 bg-blue-500"></div>
      <div className="flex flex-1 justify-between items-center px-4">
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
