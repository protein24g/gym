import { FC, useEffect, useState } from "react"
import Box from "../../components/ui/Box"
import { FaCheck, FaUsers } from "react-icons/fa"
import { PiNetwork } from "react-icons/pi"
import { RiUserSettingsLine } from "react-icons/ri"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, CartesianGrid } from 'recharts';
import Loading from "../../components/loading/Loading"
import axios, { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authState } from "../../recoil/AuthState"

const DashboardPage: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const auth = useRecoilValue(authState);

  const [branchCount, setBranchCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [trainerCount, setTrainerCount] = useState<number>(0);
  const [todayAttendanceCount, setTodayAttendanceCount] = useState<number>(0);
  const [dailyUserRegisters, setDailyUserRegisters] = useState<{name: string, count: number}[]>();
  const [branchUserCount, setBranchUserCount] = useState<{name: string, count: number}[]>();

  const navigate = useNavigate();

  const getDashboardSummary = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/dashboard', {withCredentials: true});

      if (response.status === 200) {
        setBranchCount(response.data.branchCount);
        setUserCount(response.data.userCount);
        setTrainerCount(response.data.trainerCount);
        setTodayAttendanceCount(response.data.todayAttendanceCount);
        setDailyUserRegisters(response.data.dailyUserRegisters);
        setBranchUserCount(response.data.branchUserCount);
        
        setIsLoading(false);
      }

    } catch (error) {
      const axiosError = error as AxiosError;
      const data = axiosError.response?.data as {message: string};
      alert(data.message);
      navigate('/auth/signin');
    }
  }

  useEffect(() => {
    getDashboardSummary();
  }, [])

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <div className={`${auth && auth.role === 'ROLES_OWNER' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 text-white gap-4">
          {auth && auth.role === 'ROLES_OWNER' && (
            <Box
              icon={<PiNetwork className="w-12 h-12 p-2 bg-gray-500 rounded-full" />}
              count={branchCount}
              describe="지점"
              textColor="text-gray-500"
              borderColor="border-gray-500"
            />
          )}
          <Box
            icon={<FaUsers className="w-12 h-12 p-2 bg-blue-500 rounded-full" />}
            count={userCount}
            describe="전체 회원"
            textColor="text-blue-500"
            borderColor="border-blue-500"
          />
          <Box
            icon={<RiUserSettingsLine className="w-12 h-12 p-2 bg-blue-500 rounded-full" />}
            count={trainerCount}
            describe="트레이너"
            textColor="text-blue-500"
            borderColor="border-blue-500"
          />
          <Box
            icon={<FaCheck className="w-12 h-12 p-2 bg-green-500 rounded-full" />}
            count={todayAttendanceCount}
            describe="출석"
            textColor="text-green-500"
            borderColor="border-green-500"
          />
        </div>
        {(auth && auth.role === 'ROLES_OWNER') && (
          <div className="bg-white border-2">
            <h2 className="font-bold p-4 bg-blue-50 border-b-2 text-blue-600">지점별 회원 현황</h2>
            <div className="bg-white h-60">
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={branchUserCount} margin={{
                    top: 30,
                    right: 30,
                    left: -10,
                    bottom: 0,
                  }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4E73DF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )} 
      </div>
      <div className={`my-4 bg-white border-2 ${(auth && auth.role === 'ROLES_OWNER') ? 'col-span-2' : 'col-span-full'}`}>
        <h2 className="font-bold p-4 bg-blue-50 border-b-2 text-blue-600">일별 회원 등록 현황</h2>
        <div className="h-80">
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={dailyUserRegisters} margin={{
                top: 30,
                right: 30,
                left: -10,
                bottom: 0,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='name' tick={false} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" fill="#4E73DF" dot={{r: 2}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
