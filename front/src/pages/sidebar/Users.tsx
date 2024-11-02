import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { authState } from '../../recoil/AuthState';
import { useRecoilState } from 'recoil';

interface User {
  birth: string,
  branchId: number,
  branchName: string,
  createAt: Date,
  email: string | null,
  id: number,
  name: string,
  role: string,
  telNumber: string
}

const Users: FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [auth] = useRecoilState(authState);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const findAllUsers = async () => {
      try {
        const queryParams = queryString.parse(location.search);
        const response = await axios.get('http://localhost:3000/api/users', {
          params: queryParams,
          withCredentials: true,
        });
  
        if (Array.isArray(response.data)) {
          setUserList(response.data); // 배열일 경우에만 상태 업데이트
        } else {
          alert('API 응답이 배열이 아닙니다:' + response.data);
        }
      } catch (error) {
        return;
      }

      setIsLoading(false);
    };
    
    findAllUsers();
  }, [])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen' role="status">
        <div>
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 bg-white border-2">
      <h2 className="text-xl font-bold">회원 목록</h2>
      <div className="overflow-x-auto w-full h-full">
        <table className="table-auto my-3 border-gray-300 w-full h-full whitespace-nowrap text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">
                <input type="checkbox" />
              </th>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">이메일</th>
              <th className="border border-gray-300 px-4 py-2">이름</th>
              <th className="border border-gray-300 px-4 py-2">전화번호</th>
              <th className="border border-gray-300 px-4 py-2">생년월일</th>
              <th className="border border-gray-300 px-4 py-2">가입일</th>
              {auth.role && auth.role === "ROLES_OWNER" && (
                <>
                  <th className="border border-gray-300 px-4 py-2">권한</th>
                  <th className="border border-gray-300 px-4 py-2">지점 ID</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {userList.length > 0 ? (
              userList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    <input type="checkbox" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.telNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.birth}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(user.createAt).toLocaleString()}
                  </td>
                  {auth.role && auth.role === "ROLES_OWNER" && (
                    <>
                      <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                      <td className="border border-gray-300 px-4 py-2" id={JSON.stringify(user.branchId)}>
                        {user.branchName || 'N/A'}
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-300 px-4 py-2 text-center"
                  colSpan={9} // 열 개수를 9로 수정
                >
                  회원이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='flex justify-center my-3'>페이징</div>
    </div>
  );
};

export default Users;
