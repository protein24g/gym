import { FC } from "react"

const Box: FC<{icon: React.ReactNode, num: string}> = ({icon, num}) => {
  return (
    <div className="flex items-center justify-between h-24 px-8 rounded-lg border bg-gray-800">
      <div>{icon}</div>
      <div className="text-xl">{num}</div>
    </div>
  )
}

export default Box
