import { FC, FormEvent, useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Loading from "../../components/loading/Loading";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface MyInfoPayload {
  id: number;
  email: string;
  name: string;
  telNumber: string;
  birth: string;
  createAt: Date;
  role: string;
  branchName: string | null;
  ptTrainerId?: number;
  profileImageUrl?: string | null;
}

const MyPage: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true); // 초기 상태를 true로 설정
  const navigate = useNavigate();
  const [userData, setUserData] = useState<MyInfoPayload | null>(null); // 초기 상태를 null로 설정
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const findUserByUserId = async () => {
    setIsLoading(true); // 데이터 로딩 시작 시 true로 설정
    try {
      const response = await axios.get(`http://localhost:3000/api/mypage`, { withCredentials: true });
      console.log(response);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const data = axiosError.response?.data as { message: string };
      alert(data.message);
      navigate("/");
    } finally {
      setIsLoading(false); // 데이터 로딩 완료 후 false로 설정
    }
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:3000/api/users/id/${String(userData?.id)}`,
        {
          name: userData?.name,
          email: userData?.email,
          telNumber: userData?.telNumber,
          birth: userData?.birth
        },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      
      if (response.status === 200) {
        alert(response.data.message);
      }
      setIsEditing(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      const data = axiosError.response?.data as { message: string };
      alert(data.message);
    }
  };

  useEffect(() => {
    findUserByUserId();
  }, []);

  if (isLoading) return <Loading />; // 로딩 중일 때 로딩 화면 표시

  if (!userData) return <div>유저 데이터를 찾을 수 없습니다.</div>; // 데이터가 없을 경우 안내 메시지 표시

  return (
    <Card>
      <div className="flex flex-col items-center p-6">
        {/* 프로필 이미지 */}
        {userData.profileImageUrl ? (
          <img src={userData.profileImageUrl} alt="Profile" className="w-32 h-32 rounded-full mb-4 shadow-md object-cover" />
        ) : (
          <svg className="w-32 h-32 text-gray-400 p-2 my-2 bg-gray-300 rounded-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
        )}

        {/* 프로필 정보 또는 수정 폼 */}
        {isEditing ? (
          <form onSubmit={handleSaveChanges} className="w-full flex flex-col items-center">
            <h2 className="font-extrabold text-center mb-2">
              <span className="text-2xl">{userData.name}</span>
              <span>({userData.role.split('_')[1]})</span>
            </h2>
            <p className="text-xl font-semibold text-blue-700 mb-4">{userData.branchName}</p>
            
            {/* 입력 필드 */}
            <div className="w-full sm:w-1/2 lg:w-1/3 mb-4">
              <input
                type="email"
                value={userData.email ?? ""}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="py-2 p-2 w-full border-b font-extrabold text-center"
                placeholder="이메일"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 mb-4">
              <input
                type="text"
                value={userData.telNumber}
                onChange={(e) => setUserData({ ...userData, telNumber: e.target.value })}
                className="py-2 p-2 w-full border-b font-extrabold text-center"
                placeholder="전화번호"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 mb-4">
              <input
                type="text"
                value={userData.birth}
                onChange={(e) => setUserData({ ...userData, birth: e.target.value })}
                className="py-2 p-2 w-full border-b font-extrabold text-center"
                placeholder="생년월일"
              />
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row justify-center w-full mt-4">
              <button type="submit" className="p-2 bg-blue-500 text-white rounded w-full sm:w-1/2 mr-2 font-semibold hover:bg-blue-600">
                수정 저장
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-400 text-white rounded w-full sm:w-1/2 font-semibold hover:bg-gray-500 mt-2 sm:mt-0"
              >
                수정 취소
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="font-extrabold text-center mb-2">
              <span className="text-2xl">{userData.name}</span>
              <span>({userData.role.split('_')[1]})</span>
            </h2>
            <p className="text-xl font-semibold text-blue-700 mb-4">{userData.branchName}</p>
            <p className="text-sm text-gray-600">{userData.email ?? "이메일 없음"}</p>
            <p className="text-sm text-gray-600">{userData.telNumber}</p>
            <p className="text-sm text-gray-600">{userData.birth}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 p-3 bg-blue-500 text-white rounded w-full sm:w-3/4 font-semibold hover:bg-blue-600"
            >
              수정하기
            </button>
          </>
        )}
      </div>
    </Card>
  );
};

export default MyPage;