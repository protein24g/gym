import { FC, useEffect, useState } from 'react';
import axios from 'axios';

const Users: FC = () => {
  const [userList, setUserList] = useState<any[]>([]); // any[]로 유저 타입 유연하게 처리
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const findAllUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users', {
          withCredentials: true,
        });

        if (Array.isArray(response.data)) {
          setUserList(response.data); // 배열일 경우에만 상태 업데이트
        } else {
          alert('API 응답이 배열이 아닙니다:' + response.data);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    findAllUsers();
  }, []);

  return !isLoading && (
    <div className="p-3 bg-white border-2">
      <h2 className="text-xl font-bold mb-4">회원 목록</h2>
      <div className="overflow-x-auto w-full h-full">
        <table className="table-auto border-gray-300 w-full h-full whitespace-nowrap text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">이메일</th>
              <th className="border border-gray-300 px-4 py-2">이름</th>
              <th className="border border-gray-300 px-4 py-2">전화번호</th>
              <th className="border border-gray-300 px-4 py-2">생년월일</th>
              <th className="border border-gray-300 px-4 py-2">가입일</th>
              <th className="border border-gray-300 px-4 py-2">권한</th>
              <th className="border border-gray-300 px-4 py-2">지점 ID</th>
            </tr>
          </thead>
          <tbody>
            {userList.length > 0 ? (
              userList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.telNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.birth}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(user.createAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                  <td className="border border-gray-300 px-4 py-2" id={user.branchId}>
                    {user.branchName || 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-300 px-4 py-2 text-center"
                  colSpan={8}
                >
                  회원이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
