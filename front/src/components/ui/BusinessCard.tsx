import { FC } from "react"

const BusinessCard: FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className="m-4 p-6 pr-0 bg-white shadow-[0px_0px_20px_10px_rgba(0,0,0,0.1)] w-80 mix-w-sm h-44 border hover:border-gray-500">
      {children}
    </div>
  )
}

export default BusinessCard
