import { FC, useEffect, useState, FormEvent } from "react";
import Card from "../../../ui/Card";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../loading/Loading";
import { IoIosSettings } from "react-icons/io";
import { MdOutlineMailOutline, MdPhoneIphone } from "react-icons/md";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

interface UserInfoPayload {
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

const UserInfo: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const param = useParams();
  const [userData, setUserData] = useState<UserInfoPayload | null>(null); // 초기 상태를 null로 설정
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const findUserByUserId = async () => {
    if (!param.userId) {
      alert("존재하지 않는 유저");
      navigate("/");
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/users/id/${param.userId}`, { withCredentials: true });
      if (response.status === 200) {
        setUserData(response.data.user);
        setIsLoading(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const data = axiosError.response?.data as { message: string };
      alert(data.message);
      navigate("/");
    }
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:3000/api/users/id/${param.userId}`,
        {
          name: userData?.name,
          email: userData?.email,
          telNumber: userData?.telNumber,
          birth: userData?.birth
        },
        { withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
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

  if (isLoading) return <Loading />;

  if (!userData) return <div>유저 데이터를 찾을 수 없습니다.</div>; // 데이터가 없을 경우 안내 메시지 표시

  return (
    <Card>
      <div className="flex flex-col items-center relative">
        {/* 프로필 이미지 */}
        <div className="mb-6">
          {userData.profileImageUrl ? (
            <img
              src={userData.profileImageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full shadow-lg object-cover"
            />
          ) : (
            <svg
              className="w-28 h-28 rounded-full bg-gray-300 text-gray-200 mx-auto"
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
        </div>

        {/* 프로필 정보 또는 수정 폼 */}
        {isEditing ? (
          <form onSubmit={handleSaveChanges} className="w-full flex flex-col items-center">
            <h2 className="font-extrabold text-2xl text-center mb-4">
              <span>{userData.name}</span>
              <span className="text-sm text-gray-500"> ({userData.role.split('_')[1]})</span>
            </h2>
            <p className="text-xl font-semibold text-blue-700 mb-6">{userData.branchName}</p>

            {/* 이메일 */}
            <div className="w-full sm:w-3/4 lg:w-1/2 mb-5">
              <label className="block text-gray-700 font-semibold mb-2">이메일</label>
              <input
                type="email"
                value={userData.email ?? ""}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="py-2 px-4 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이메일"
              />
            </div>

            {/* 전화번호 */}
            <div className="w-full sm:w-3/4 lg:w-1/2 mb-5">
              <label className="block text-gray-700 font-semibold mb-2">전화번호</label>
              <input
                type="text"
                value={userData.telNumber}
                onChange={(e) => setUserData({ ...userData, telNumber: e.target.value })}
                className="py-2 px-4 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="전화번호"
              />
            </div>

            {/* 생년월일 */}
            <div className="w-full sm:w-3/4 lg:w-1/2 mb-8">
              <label className="block text-gray-700 font-semibold mb-2">생년월일</label>
              <input
                type="text"
                value={userData.birth}
                onChange={(e) => setUserData({ ...userData, birth: e.target.value })}
                className="py-2 px-4 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="생년월일"
              />
            </div>

            {/* 수정/취소 버튼 */}
            <div className="flex flex-col sm:flex-row justify-center w-full gap-4">
              <button
                type="submit"
                className="w-full sm:w-1/2 p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-1/2 p-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition duration-200"
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute right-0"
            >
              <IoIosSettings className="w-8 h-8" />
            </button>
            {/* 프로필 정보 출력 */}
            <h2 className="font-extrabold text-2xl text-center mb-4">
              <span>{userData.name}</span>
              <span className="text-sm text-gray-500"> ({userData.role.split('_')[1]})</span>
            </h2>
            <p className="text-xl font-semibold text-blue-700 mb-6">{userData.branchName}</p>

            {/* 이메일 */}
            <div className="w-full sm:w-3/4 lg:w-1/2 mb-4">
              <p className="text-sm text-gray-600 flex items-center">
                <MdOutlineMailOutline className="w-5 h-5 text-blue-500 mr-2" />
                {userData.email ?? "이메일 없음"}
              </p>
            </div>

            {/* 전화번호 */}
            <div className="w-full sm:w-3/4 lg:w-1/2 mb-4">
              <p className="text-sm text-gray-600 flex items-center">
                <MdPhoneIphone className="w-5 h-5 text-blue-500 mr-2" />
                {userData.telNumber}
              </p>
            </div>

            {/* 생년월일 */}
            <div className="w-full sm:w-3/4 lg:w-1/2 mb-4">
              <p className="text-sm text-gray-600 flex items-center">
                <LiaBirthdayCakeSolid className="w-5 h-5 text-blue-500 mr-2" />
                {userData.birth}
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default UserInfo;
