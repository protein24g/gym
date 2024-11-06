import { FC, useEffect, useState } from "react"
import Card from "../ui/Card"
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
import axios, { AxiosError } from "axios";

export interface TrainerPayload {
  id: number;
  name: string;
  introduction: string;
  qualifications: string[];
  careerDetails: string[];
}

const TrainerList: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setTrainers] = useState<TrainerPayload[]>([]);

  const findAllTrainers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/trainers', {withCredentials: true});

      if (response.data) {
        setTrainers(response.data);
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
      <div className='flex justify-between'>
          <span className="text-lg xl:text-2xl my-2 font-bold">트레이너 목록({trainers.length}명)</span>
        </div>
        <div className="overflow-x-auto w-full h-full">
          <table className="table-auto my-3 border-gray-300 w-full h-full whitespace-nowrap text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">이름</th>
                <th className="border border-gray-300 px-4 py-2">소개</th>
                <th className="border border-gray-300 px-4 py-2">자격사항</th>
                <th className="border border-gray-300 px-4 py-2">경력사항</th>
              </tr>
            </thead>
            <tbody>
              {trainers.length > 0 ? (
                trainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{trainer.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{trainer.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{trainer.introduction}</td>
                    <td className="border border-gray-300 px-4 py-2">{trainer.qualifications}</td>
                    <td className="border border-gray-300 px-4 py-2">{trainer.careerDetails}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="border border-gray-300 px-4 py-2 text-center"
                    colSpan={9}
                  >
                    수강생이 없습니다
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
