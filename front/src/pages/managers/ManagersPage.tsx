import { FC } from "react"
import ManagerList from "../../components/managers/ManagerList"
import Card from "../../components/ui/Card"
import { Link } from "react-router-dom"
import BusinessCard from "../../components/ui/BusinessCard"
import logoImageWhite1 from "../../assets/logoImage-1-white.png";

const ManagersPage: FC = () => {
  return (
    <>
      <ManagerList />
      <Card>
        <Link to={'/managers/manage'} className="px-4 py-2 bg-blue-500 text-white rounded-xl">+ 생성</Link>
        <BusinessCard>
            <div className="flex flex-1 h-full">
              <div className="w-full flex flex-col">
                <div className="flex-1">
                  <input className="font-bold text-lg border-b" placeholder="이름"/>
                  <p className="text-xs"></p>
                </div>
                <div className="text-xs">
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
              </div>
              <div className="w-full h-full flex items-center">
                <img src={logoImageWhite1} className="w-full h-full" alt="logo" />
              </div>
            </div>
          </BusinessCard>
      </Card>
    </>
  )
}

export default ManagersPage
