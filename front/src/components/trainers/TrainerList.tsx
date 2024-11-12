import { FC, useEffect, useState } from "react"
import Card from "../ui/Card"
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
import axios, { AxiosError } from "axios";
import { useRecoilValue } from "recoil";
import { authState } from "../../recoil/AuthState";

export interface TrainerPayload {
  id: number;
  name: string;
  introduction: string;
  qualifications: string[];
  careerDetails: string[];
  profileImageUrl: string | null;
  studentsCount: number;
  branchName: string;
}

const TrainerList: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setTrainers] = useState<TrainerPayload[]>([]);
  const auth = useRecoilValue(authState);

  const findAllTrainers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/trainers', {withCredentials: true});

      if (response.status === 200) {
        if (response.data !== '') {
          setTrainers(response.data);
        }
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
    findAllTrainers();
  }, [])

  if (isLoading) return <Loading />;

  return (
    <Card>
      {/* {trainer.profileImageUrl ? <img src={trainer.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-full" /> : <CgProfile className="w-10 h-10 rounded-full"/>} */}
      {/* <span>{trainer.introduction}</span> */}

      <div className='flex justify-between mb-4'>
        <div className='text-lg'>
          <span className="xl:text-2xl my-2 font-bold">트레이너 목록</span>
          <span className='font-bold'>({trainers.length}명)</span>
        </div>
      </div>
      <div className="overflow-x-auto w-full h-full">
        <table className="table-auto my-3 border-gray-300 w-full h-full whitespace-nowrap text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">이름</th>
              <th className="border border-gray-300 px-4 py-2">수강생</th>
              {auth.role && auth.role === "ROLES_OWNER" && (
                <>
                  <th className="border border-gray-300 px-4 py-2">지점</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {trainers.length > 0 ? (
              trainers.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-gray-50" onClick={() => {window.open(`/userinfo/${trainer.id}`, '_blank', 'width=600,height=400,top=100,left=100')}}>
                  <td className="border border-gray-300 px-4 py-2">{trainer.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{trainer.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{trainer.studentsCount}</td>
                  {auth && auth.role === "ROLES_OWNER" && (
                    <>
                      <td className="border border-gray-300 px-4 py-2" id={JSON.stringify(trainer.id)}>
                        {trainer.branchName}
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-300 px-4 py-2 text-center"
                  colSpan={9}
                >
                  트레이너가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default TrainerList
