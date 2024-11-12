import { FC, useEffect, useState } from "react"
import Card from "../ui/Card"
import Loading from "../loading/Loading";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import BusinessCard from "../ui/businessCard";
import logoImageWhite1 from "../../assets/logoImage-1-white.png";

interface ManagerInfo {
  email: string;
  name: string;
  telNumber: string;
  branchName: string;
  address: string;
}

const ManagerList: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const [branchList, setBranchList] = useState<ManagerInfo[]>([]);

  const findAllManagers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/managers', {withCredentials: true});

      setBranchList(response.data);
      setIsLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError.message);
      navigate('/auth/signin');
    }
  }

  useEffect(() => {
    findAllManagers();
  }, [])

  if (isLoading) return <Loading />;

  return (
    <Card>
      <div className='text-lg'>
        <span className="xl:text-2xl my-2 font-bold">지점</span>
        <span className='font-bold'>({branchList.length}개)</span>
      </div>
      <div className="flex flex-wrap justify-evenly">
        {branchList.map((branch, index) => (
          <BusinessCard key={index}>
            <div className="flex flex-1 h-full">
              <div className="w-full flex flex-col">
                <div className="flex-1">
                  <p className="font-bold text-lg">{branch.name}</p>
                  <p className="text-xs">{branch.branchName}</p>
                </div>
                <div className="text-xs">
                  <p>{branch.email}</p>
                  <p>{branch.telNumber}</p>
                  <p>{branch.address}</p>
                </div>
              </div>
              <div className="w-full h-full flex items-center">
                <img src={logoImageWhite1} className="w-full h-full" alt="logo" />
              </div>
            </div>
          </BusinessCard>
        ))}
      </div>
    </Card>
  )
}

export default ManagerList
