import { FC } from "react"

const Card: FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className="m-4 p-4 bg-white border-2 text-sm">
      {children}
    </div>
  )
}

export default Card
