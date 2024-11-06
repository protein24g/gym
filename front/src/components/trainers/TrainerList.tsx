import { FC, useEffect, useState } from "react"
import Card from "../ui/Card"
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
import axios, { AxiosError } from "axios";
import { CgProfile } from "react-icons/cg";

export interface TrainerPayload {
  id: number;
  name: string;
  introduction: string;
  qualifications: string[];
  careerDetails: string[];
  profileImageUrl: string | null;
  studentsCount: number;
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
      <span className="text-lg xl:text-2xl my-2 font-bold">트레이너 목록({trainers.length}명)</span>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {trainers.length > 0 ? (
          trainers.map((trainer) => (
            <div key={trainer.id} className="text-white m-2 border rounded-lg shadow bg-gray-800 border-gray-700">
              <div className="flex flex-col items-center py-10 gap-2">
                {trainer.profileImageUrl ? <img src={trainer.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-full" /> : <CgProfile className="w-10 h-10 rounded-full"/>}
                <h5 className="text-xl font-medium">{trainer.name}({trainer.studentsCount})</h5>
                <span>{trainer.introduction}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex w-full h-full justify-center items-center">
            <span>수강생이 없습니다</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default TrainerList
