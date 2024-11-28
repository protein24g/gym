import { FC, useEffect, useState } from "react";
import Box from "../../components/ui/Box";
import { FaCheck, FaUsers } from "react-icons/fa";
import { PiNetwork } from "react-icons/pi";
import { RiUserSettingsLine } from "react-icons/ri";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, CartesianGrid, Legend } from 'recharts';
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
  const [recentMonthAttendance, setRecentMonthAttendance] = useState<Record<string, string | number>[]>();

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
        setRecentMonthAttendance(response.data.userAttendances);
        
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
            describe="최근 한달 출석 수"
            textColor="text-green-600"
            borderColor="border-green-600"
          />
        </div>
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg">
          <p className="font-bold p-4 bg-slate-100 text-blue-600 text-xl rounded-t-lg">
            {auth && auth.role === 'ROLES_OWNER' ? '지점별 회원 현황' : '출석 현황'}
          </p>
          <div className="h-72 p-4">
            {auth && auth.role === 'ROLES_OWNER' ? (
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={branchUserCount} margin={{ top: 30, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4E73DF" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={recentMonthAttendance} margin={{ top: 30, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey='name' tick={false} />
                  <YAxis />
                  <Tooltip />
                  <Area key='name' type="monotone" dataKey='count' fill="#4E73DF" dot={{r: 3}} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentMonthAttendance} margin={{ top: 0, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={false} />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                {/* 데이터에서 'name' 키를 제외한 나머지 키로 Area 컴포넌트 생성 */}
                {recentMonthAttendance && Object.keys(recentMonthAttendance[0])
                  .filter((key) => key !== "name") // 'name' 제외
                  .map((key, index) => {
                    // 호점별로 색상을 지정
                    const colors = ['#4E73DF', '#1CC88A', '#36B9CC', '#F6C23E', '#E74A3B']; // 색상 배열
                    const color = colors[index % colors.length]; // 색상 순환
                    
                    return (
                      <Area
                        key={key} // 고유한 키 설정
                        type="monotone"
                        dataKey={key} // dataKey를 점포 이름으로 설정
                        fill={color} // 각 호점에 고유 색상 적용
                        stroke={color} // 선 색상도 동일하게 설정
                        dot={{ r: 3 }} // 점 크기 설정
                      />
                    );
                  })
                }
              </AreaChart>
            </ResponsiveContainer>
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
