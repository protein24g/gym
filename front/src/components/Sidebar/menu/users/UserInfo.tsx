import { FC, useEffect, useState, FormEvent } from "react";
import Card from "../../../ui/Card";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../loading/Loading";

interface UserInfoPayload {
  email: string | null;
  name: string;
  telNumber: string;
  birth: string;
  createAt: Date;
  role: string;
  branchId: number;
  branchName: string;
  profileImageUrl: string | null;
}

const UserInfo: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const param = useParams();
  const [userData, setUserData] = useState<UserInfoPayload>();
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
      
      console.log(response);
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

  return (
    <Card>
      {userData && (
        <div className="flex flex-col items-center p-6">
          {userData.profileImageUrl ? (
            <img src={userData.profileImageUrl} alt="Profile" className="w-24 h-24 rounded-full mb-4 shadow-md object-cover" />
          ) : (
            <svg className="w-24 h-24 text-gray-400 p-2 my-2 bg-gray-300 rounded-full -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
          )}
          {isEditing ? (
            <form onSubmit={handleSaveChanges} className="w-full flex flex-col items-center">
              <h2 className="font-extrabold text-center mb-2">
                <span className="text-2xl">{userData.name}</span>
                <span>({userData.role.split('_')[1]})</span>
              </h2>
              <p className="text-xl font-semibold text-blue-700 mb-4">{userData.branchName}</p>
              
              <input
                type="email"
                value={userData.email ?? ""}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="py-2 p-2 w-1/2 border-b font-extrabold text-center"
                placeholder="이메일"
              />
              <input
                type="text"
                value={userData.telNumber}
                onChange={(e) => setUserData({ ...userData, telNumber: e.target.value })}
                className="py-2 p-2 w-1/2 border-b font-extrabold text-center"
                placeholder="전화번호"
              />
              <input
                type="text"
                value={userData.birth}
                onChange={(e) => setUserData({ ...userData, birth: e.target.value })}
                className="py-2 p-2 w-1/2 border-b font-extrabold text-center"
                placeholder="생년월일"
              />
              <div className="flex justify-between w-full mt-4">
                <button type="submit" className="p-2 bg-blue-500 text-white rounded w-1/2 mr-2 font-semibold hover:bg-blue-600">
                  수정 저장
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-gray-400 text-white rounded w-1/2 font-semibold hover:bg-gray-500"
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
                className="mt-4 p-3 bg-blue-500 text-white rounded w-3/4 font-semibold hover:bg-blue-600"
              >
                수정하기
              </button>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default UserInfo;
