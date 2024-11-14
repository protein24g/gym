import { FC, useEffect, useState } from "react";
import Box from "../../components/ui/Box";
import { FaCheck, FaUsers } from "react-icons/fa";
import { PiNetwork } from "react-icons/pi";
import { RiUserSettingsLine } from "react-icons/ri";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, CartesianGrid } from 'recharts';
import Loading from "../../components/loading/Loading";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../../recoil/AuthState";

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
  };

  useEffect(() => {
    getDashboardSummary();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="m-4">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className="grid grid-cols-1 sm:grid-cols-2 text-white gap-6">
        {auth && auth.role === 'ROLES_OWNER' && (
            <Box
              icon={<PiNetwork className="w-14 h-14 p-3 bg-gradient-to-r from-gray-600 to-gray-400 text-white rounded-xl shadow-lg" />}
              count={branchCount}
              describe="지점"
              textColor="text-gray-600"
              borderColor="border-gray-600"
            />
          )}
          <Box
            icon={<FaUsers className="w-14 h-14 p-3 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-xl shadow-lg" />}
            count={userCount}
            describe="전체 회원"
            textColor="text-indigo-600"
            borderColor="border-indigo-600"
          />
          <Box
            icon={<RiUserSettingsLine className="w-14 h-14 p-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-xl shadow-lg" />}
            count={trainerCount}
            describe="트레이너"
            textColor="text-purple-600"
            borderColor="border-purple-600"
          />
          <Box
            icon={<FaCheck className="w-14 h-14 p-3 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl shadow-lg" />}
            count={todayAttendanceCount}
            describe="출석"
            textColor="text-green-600"
            borderColor="border-green-600"
          />
        </div>
        {auth && auth.role === 'ROLES_OWNER' ?
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg">
            <h2 className="font-bold p-4 bg-slate-100 text-blue-600 text-xl rounded-t-lg">지점별 회원 현황</h2>
            <div className="h-72 p-4">
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={branchUserCount} margin={{ top: 30, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4E73DF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          :
          <div className='bg-white border-2 border-gray-300 rounded-lg shadow-lg'>
            <h2 className="font-bold p-4 bg-slate-100 text-blue-600 text-xl rounded-t-lg">출석 현황</h2>
            <div className="h-72 p-4">
              {/* 출석 그래프 */}
            </div>
          </div>
        }
      </div>
      {auth && auth.role === 'ROLES_OWNER' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className='my-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg'>
            <h2 className="font-bold p-4 bg-slate-100 text-blue-600 text-xl rounded-t-lg">일별 회원 등록 현황</h2>
            <div className="h-72 p-4">
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={dailyUserRegisters} margin={{ top: 30, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey='name' tick={false} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" fill="#4E73DF" dot={{r: 3}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='my-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg'>
            <h2 className="font-bold p-4 bg-slate-100 text-blue-600 text-xl rounded-t-lg">출석 현황</h2>
            <div className="h-72 p-4">
              {/* 출석 그래프 */}
            </div>
          </div>
        </div>
      )
      :
      <div className={`my-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg`}>
        <h2 className="font-bold p-4 bg-slate-100 text-blue-600 text-xl rounded-t-lg">일별 회원 등록 현황</h2>
        <div className="h-72 p-4">
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={dailyUserRegisters} margin={{ top: 30, right: 30, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='name' tick={false} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" fill="#4E73DF" dot={{r: 3}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      }
    </div>
  );
};

export default DashboardPage;
