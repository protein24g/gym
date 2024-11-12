import { FC, useEffect, useState } from "react"
import Card from "../ui/Card"
import Loading from "../loading/Loading";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export interface StudentPayload {
  id: number;
  email: string | null;
  name: string;
  telNumber: string;
  birth: string;
  createAt: Date;
  role: string;
  branchId: number;
  branchName: string;
}

const StudentList: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<StudentPayload[]>([]);

  const findAllStudens = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/trainers/users', {withCredentials: true});

      if (response.status === 200) {
        if (response.data) {
          setStudents(response.data);
        }
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
    findAllStudens();
  }, [])

  if (isLoading) return <Loading />;

  return (
    <Card>
      <div className='flex justify-between'>
        <span className="text-lg xl:text-2xl my-2 font-bold">수강생 목록({students.length}명)</span>
      </div>
      <div className="overflow-x-auto w-full h-full">
        <table className="table-auto my-3 border-gray-300 w-full h-full whitespace-nowrap text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">이름</th>
              <th className="border border-gray-300 px-4 py-2">이메일</th>
              <th className="border border-gray-300 px-4 py-2">휴대폰</th>
              <th className="border border-gray-300 px-4 py-2">생년월일</th>
              <th className="border border-gray-300 px-4 py-2">가입일</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{student.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.telNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.birth}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.createAt ? new Date(student.createAt).toLocaleString() : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-300 px-4 py-2 text-center"
                  colSpan={9}
                >
                  수강생이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default StudentList
