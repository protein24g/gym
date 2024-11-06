import { FC, useEffect, useState } from "react"
import Card from "../../../ui/Card"
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

interface UserInfoPayload {
  id: number;
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
  const navigate = useNavigate();
  const param = useParams();
  const [userData, setUserData] = useState<UserInfoPayload>();

  const findUserByUserId = async () => {
    if (!param.userId) {
      alert('존재하지 않는 유저');
      navigate('/');
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/users/id/${param.userId}`, {withCredentials: true});

      if (response.status === 200) {
        setUserData(response.data.user);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        alert('존재하지 않는 유저');
      }
    }
  }

  useEffect(() => {
    findUserByUserId();
  }, []);

  return (
    <Card>
      {userData && ( // userData가 존재할 때만 렌더링
          <div className="flex flex-col items-center">
            {userData.profileImageUrl ?
            <img src={(userData.profileImageUrl ? userData.profileImageUrl : '')} alt="Profile" className="w-44 h-24 mb-4" />
            :
            <CgProfile className="w-10 h-10" />
            }
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">{userData.telNumber}</p>
            <p className="text-gray-600">{userData.birth}</p>
            <p className="text-gray-600">가입일: {new Date(userData.createAt).toLocaleDateString()}</p>
            <p className="text-gray-600">지점: {userData.branchName}</p>
            <p className="text-gray-600">권한: {userData.role}</p>
          </div>
        )}
    </Card>
  )
}

export default UserInfo
