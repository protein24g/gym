import { FC, useEffect, useState } from "react"
import Box from "../../components/ui/Box"
import { FaCheck, FaUsers } from "react-icons/fa"
import { PiNetwork } from "react-icons/pi"
import { RiUserSettingsLine } from "react-icons/ri"
import Card from "../../components/ui/Card"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import Loading from "../../components/loading/Loading"
import axios, { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authState } from "../../recoil/AuthState"

const chartData = [
  { name: '1지점', user: 65 },
  { name: '2지점', user: 59 },
  { name: '3지점', user: 80 },
];

const DashboardPage: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const auth = useRecoilValue(authState);

  const [branchCount, setBranchCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [trainerCount, setTrainerCount] = useState<number>(0);
  const [todayAttendanceCount, setTodayAttendanceCount] = useState<number>(0);
  const [dailyUserRegisters, setDailyUserRegisters] = useState<{name: string, count: number}[]>();

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
        
        console.log(response.data.dailyUserRegisters);

        setIsLoading(false);
      }

      
    } catch (error) {
      const axiosError = error as AxiosError;
      const data = axiosError.response?.data as {message: string};
      alert(data.message);
      navigate('/');
    }
  }

  useEffect(() => {
    getDashboardSummary();
  }, [])

  if (isLoading) return <Loading />;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-white gap-8 px-4">
        {auth && auth.role === 'ROLES_OWNER' && (
          <Box icon={<PiNetwork className="w-12 h-12 p-2 bg-gray-500 rounded-full"/>} count={branchCount} describe={'지점'}/>
        )}
        <Box icon={<FaUsers className="w-12 h-12 p-2 bg-blue-500 rounded-full"/>} count={userCount} describe={'전체 회원'}/>
        <Box icon={<RiUserSettingsLine className="w-12 h-12 p-2 bg-blue-500 rounded-full"/>} count={trainerCount} describe={'트레이너'}/>
        <Box icon={<FaCheck className="w-12 h-12 p-2 bg-green-500 rounded-full"/>} count={todayAttendanceCount} describe={'출석'}/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className={`${(auth && auth.role === 'ROLES_OWNER') ? 'col-span-2' : 'col-span-full'}`}>
          <Card>
            <div className="p-4 bg-white rounded shadow-md">
              <h2 className="text-lg font-semibold text-center mb-4">일별 회원 등록 현황</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyUserRegisters} margin={{
                    top: 0,
                    right: 0,
                    left: -35,
                    bottom: 0,
                  }}>
                  <XAxis dataKey='name' tick={false} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" fillOpacity={0.1} dot={{r: 3}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        {(auth && auth.role === 'ROLES_OWNER') && (
          <div className="'col-span-2'">
            <Card>
            <div className="p-4 bg-white rounded shadow-md">
              <h2 className="text-lg font-semibold text-center mb-4">지점별 회원 수</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{
                    top: 0,
                    right: 0,
                    left: -35,
                    bottom: 0,
                  }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="user" fill="#8884d8"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          </div>
        )}  
      </div>
    </div>
  )
}

export default DashboardPage
