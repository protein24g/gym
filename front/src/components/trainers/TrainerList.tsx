import { FC, useEffect, useState } from "react";
import Card from "../ui/Card";
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
      const response = await axios.get("http://localhost:3000/api/trainers", {
        withCredentials: true,
      });

      if (response.status === 200) {
        if (response.data !== "") {
          setTrainers(response.data);
        }
        setIsLoading(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const data = axiosError.response?.data as { message: string };
      alert(data.message);
      navigate("/");
    }
  };

  useEffect(() => {
    findAllTrainers();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <Card>
      <div className="flex justify-between mb-4">
        <div className="text-lg">
          <span className="xl:text-2xl my-2 font-bold">트레이너 목록</span>
          <span className="font-bold">({trainers.length}명)</span>
        </div>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.length > 0 ? (
          trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="card border border-gray-300 p-4 shadow-lg rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                window.open(
                  `/userinfo/${trainer.id}`,
                  "_blank",
                  "width=600,height=400,top=100,left=100"
                );
              }}
            >
              <div className="flex items-center mb-4">
                {trainer.profileImageUrl ? (
                  <img
                    src={trainer.profileImageUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                ) : (
                  <svg className="w-16 h-16 text-gray-400 p-2 mr-4 bg-gray-300 rounded-full -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{trainer.name}</h3>
                  {auth.role && auth.role === "ROLES_OWNER" && (
                    <span className="text-blue-500 font-bold">{trainer.branchName}</span>
                  )}
                  <p className="text-sm text-gray-500">ID: {trainer.id}</p>
                </div>
              </div>
              
              <p className="text-gray-700">{trainer.introduction}</p>
              <div className="mt-4 text-gray-600">
                <span>수강생: {trainer.studentsCount}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            트레이너가 없습니다
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrainerList;
