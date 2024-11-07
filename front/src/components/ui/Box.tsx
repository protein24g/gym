import { FC } from "react"

const Box: FC<{icon: React.ReactNode, num: string, describe: string}> = ({icon, num, describe}) => {
  return (
    <div className="mb-0 flex flex-col justify-between m-4 p-4 xl:px-8 bg-white rounded-lg border">
      <div className="flex justify-between">
        <p className="text-gray-400 font-bold">{describe}</p>
        <div>{icon}</div>
      </div>
      <div>
        <p className="text-black text-2xl font-bold">{num}</p>
      </div>
    </div>
  )
}

export default Box
