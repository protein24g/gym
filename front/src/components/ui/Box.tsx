import { FC } from "react"

const Box: FC<{icon: React.ReactNode, num: string, describe: string}> = ({icon, num, describe}) => {
  return (
    <div className="mb-0 flex flex-col justify-between m-4 p-4 bg-white rounded-lg border">
      <div className="flex justify-between">
        <p className="text-gray-400 font-bold">{describe}</p>
        <div>{icon}</div>
      </div>
      <div>
        <p className="text-black text-2xl font-bold">{num}</p>
      </div>
    </div>
    // <div className="flex m-4 p-4 bg-white rounded-lg border text-sm gap-4">
    //   <div>{icon}</div>
    //   <div className="flex flex-col gap-1">
    //     <p className="text-black text-xl font-bold">{num}</p>
    //     <p className="text-gray-400 font-bold">{describe}</p>
    //   </div>
    // </div>
  )
}

export default Box
