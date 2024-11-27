import { FC, useEffect, useState } from "react";
import Card from "../ui/Card";
import Loading from "../loading/Loading";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../../recoil/AuthState";
import { HiMinusCircle } from "react-icons/hi";

export interface TrainerPayload {
  id: number;
  name: string;
  introduction: string;
  qualifications: string[] | null;
  careerDetails: string[] | null;
  profileImageUrl: string | null;
  studentsCount: number;
  branchName: string;
}

// 지점별 색상 및 그라디언트 매핑
const branchColors: { [key: string]: string } = {
  "몸좋아GYM 1호점": "bg-gradient-to-r from-blue-400 to-indigo-600",
  "몸좋아GYM 2호점": "bg-gradient-to-r from-green-400 to-teal-500",
  "몸좋아GYM 3호점": "bg-gradient-to-r from-pink-400 to-rose-600",
  "몸좋아GYM 4호점": "bg-gradient-to-r from-purple-400 to-violet-600",
  "몸좋아GYM 5호점": "bg-gradient-to-r from-red-400 to-yellow-500",
};

const TrainerList: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setTrainers] = useState<TrainerPayload[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerPayload | null>(null); // 선택된 트레이너 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
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

  const deleteTrainer = async (id: number) => {
    if (confirm("삭제 하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:3000/api/trainers/${id}`, {
          withCredentials: true,
        });
        alert("삭제 성공");
        findAllTrainers();
      } catch (error) {
        const axiosError = error as AxiosError;
        alert(axiosError.message);
      }
    }
  };

  // 모달이 열리면, 해당 트레이너의 정보를 설정하고 모달을 표시
  const openModal = (trainer: TrainerPayload) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrainer(null);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {/* 트레이너 목록 UI */}
      <Card>
        <div className="flex justify-between mb-8">
          <div className="text-lg md:text-2xl font-semibold text-gray-800">
            <span>트레이너 목록</span>
            <span className="ml-2 text-sm font-normal text-gray-500">({trainers.length}명)</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.length > 0 ? (
            trainers.map((trainer) => {
              // 지점 이름에 따른 배경색 선택
              const branchColor = branchColors[trainer.branchName] || "bg-gray-300"; // 기본 색상 (지점이 매핑되지 않으면 회색)

              return (
                <div className="group relative hover:scale-105 transition-transform">
                  <div
                    key={trainer.id}
                    className={`card p-6 shadow-lg rounded-lg transition-transform ${branchColor} text-white cursor-pointer`}
                    onClick={() => openModal(trainer)} // 트레이너 클릭 시 모달 열기
                  >
                    <div className="flex items-center mb-6">
                      {trainer.profileImageUrl ? (
                        <img
                          src={trainer.profileImageUrl}
                          alt="Profile"
                          className="w-20 h-20 rounded-full mr-4 border-2 border-white"
                        />
                      ) : (
                        <svg
                          className="w-20 h-20 rounded-full bg-gray-300 text-gray-200 mr-4"
                          fill="currentColor"
                          viewBox="2 2 16 14"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold">{trainer.name}</h3>
                        {auth.role && auth.role === "ROLES_OWNER" && (
                          <span className="block mt-1 text-sm">{trainer.branchName}</span>
                        )}
                        <p className="text-sm text-gray-200 mt-1">ID: {trainer.id}</p>
                      </div>
                    </div>

                    <p className="mb-4">
                      {trainer.introduction || "소개글이 없습니다."}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold">수강생: {trainer.studentsCount}명</span>
                    </div>
                  </div>
                  {auth.role === 'ROLES_MANAGER' && (
                    <div className="absolute right-2 top-2 hidden group-hover:block">
                      <HiMinusCircle
                        className="text-red-500 w-6 h-6"
                        onClick={() => {
                          deleteTrainer(trainer.id);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              트레이너가 없습니다
            </div>
          )}
        </div>
      </Card>
      {/* Tailwind CSS로 구현한 프로필 보기 모달 */}
      {isModalOpen && selectedTrainer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={closeModal}>
          <div 
            className="bg-white rounded-lg p-6 w-96 max-w-full relative"
            onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파를 막음
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* 트레이너 프로필 이미지 및 기본 정보 */}
            <div className="flex items-center mb-6">
              {selectedTrainer.profileImageUrl ? (
                <img
                  src={selectedTrainer.profileImageUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-gray-300"
                />
              ) : (
                <svg
                  className="w-24 h-24 rounded-full bg-gray-300 text-gray-200"
                  fill="currentColor"
                  viewBox="2 2 16 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-800">{selectedTrainer.name}</h3>
                <p className="text-sm text-gray-600">{selectedTrainer.branchName}</p>
              </div>
            </div>

            {/* 트레이너 소개 */}
            <div className="mt-4">
              <h4 className="font-semibold text-lg text-gray-800">소개</h4>
              <p className="text-gray-600">{selectedTrainer.introduction || "소개글이 없습니다."}</p>
            </div>

            {/* 자격사항 */}
            <div className="mt-6">
              <h4 className="font-semibold text-lg text-gray-800">자격사항</h4>
              {selectedTrainer.qualifications && selectedTrainer.qualifications.length > 0 ? (
                <ul className="list-disc ml-6 text-gray-600">
                  {selectedTrainer.qualifications.map((qualification, index) => (
                    <li key={index}>{qualification}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">자격증 정보가 없습니다.</p>
              )}
            </div>

            {/* 경력사항 */}
            <div className="mt-6">
              <h4 className="font-semibold text-lg text-gray-800">경력사항</h4>
              {selectedTrainer.careerDetails && selectedTrainer.careerDetails.length > 0 ? (
                <ul className="list-disc ml-6 text-gray-600">
                  {selectedTrainer.careerDetails.map((career, index) => (
                    <li key={index}>{career}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">경력 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerList;
