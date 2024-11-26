import { FC } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../recoil/AuthState";

const NotFound: FC = () => {
  const [auth] = useRecoilState(authState);

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-10">
      <span className="text-gray-500 text-5xl text-center">
        페이지를 찾을 수 없습니다
      </span>
      {(auth.role === 'ROLES_USER') ?
          <Link to='/my-page' className="font-bold bg-gray-300 p-3 border rounded-lg">돌아가기</Link>
        : 
          <Link to='/' className="font-bold bg-gray-300 p-3 border rounded-lg">돌아가기</Link>
      }
    </div>
  )
}

export default NotFound