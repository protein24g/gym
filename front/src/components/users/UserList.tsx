import { FC, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { authState } from '../../recoil/AuthState';
import { useRecoilValue } from 'recoil';
import Loading from '../loading/Loading';
import Card from '../ui/Card';

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

const UserList: FC = () => {
  const [userList, setUserList] = useState<User[] | null>(null);
  const auth = useRecoilValue(authState);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [, setTotalCount] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [, setPageGroup] = useState<number>(0);
  const [startPageNum, setStartPageNum] = useState<number>(0);
  const [endPageNum, setEndPageNum] = useState<number>(0);
  const [pageBtn, setPageBtn] = useState<boolean>(false);

  const [sizeSelect, setSizeSelect] = useState<number | null>(null);

  const [searchSelect, setSearchSelect] = useState<string>('name');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [, setEnter] = useState<boolean>(false);

  const findAllUsers = async () => {
    const calcPage = page ? page : 1;
    setPage(calcPage);
    const calcSize = sizeSelect ? sizeSelect : size;
    setSize(calcSize);

    const params: { page: number, size: number, select?: string, keyword?: string } = {
      page: calcPage,
      size: calcSize
    }

    if (searchKeyword.trim().length !== 0) {
      params.select = searchSelect;
      params.keyword = searchKeyword;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        params,
        withCredentials: true,
      });
      if (response.data) {
        if (!response.data.totalCount) { // 휴대폰으로 회원 검색
          setUserList([response.data]);
        } else { // 이름으로 회원 검색
          const totalCount = response.data.totalCount;
          setTotalCount(totalCount);
          setUserList(response.data.users);
          
          const calcTotalPage = Math.ceil(totalCount / calcSize);
          setTotalPage(calcTotalPage);

          const calcPageGroup = Math.ceil(calcPage / 5);
          setPageGroup(calcPageGroup);

          const calcStartPageNum = (calcPageGroup - 1) * 5 + 1;
          setStartPageNum(calcStartPageNum);

          const calcEndPageNum = Math.min(calcPageGroup * 5, calcTotalPage);
          setEndPageNum(calcEndPageNum);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      alert((axiosError.response?.data as {message: string}).message);
      setSearchKeyword('');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    findAllUsers();
  }, [location.search, sizeSelect, setEnter, pageBtn])

  const pagination = () => {
    let ary = []
    for (let i = startPageNum; i <= endPageNum; i++) {
      ary.push(
        <div key={i} className={`px-3 lg:px-4 lg:py-2 rounded-lg flex items-center ${(page) === i ? 'bg-black text-white' : 'hover:bg-gray-100'}`} onClick={() => {setPage(i); setPageBtn(!pageBtn);}}>
          {i}
        </div>
      )
    }

    return ary;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card>
      <div className='flex justify-between mb-4'>
        <span className="text-lg xl:text-2xl my-2 font-bold">회원 목록</span>
        <select className='px-2 border rounded' onChange={(e) => {setSizeSelect(parseInt(e.target.value))}}>
          <option value={10}>10개씩 보기</option>
          <option value={20}>20개씩 보기</option>
          <option value={30}>30개씩 보기</option>
          <option value={50}>50개씩 보기</option>
          <option value={100}>100개씩 보기</option>
        </select>
      </div>
      <div className='flex'>
        <select className='border p-2' onChange={(e) => {setSearchSelect(e.target.value)}}>
          <option value={'name'}>이름</option>
          <option value={'telNumber'}>휴대폰</option>
        </select>
        <input className='border px-2' type='text' value={searchKeyword} onKeyDown={(e) => {if (e.key === 'Enter') {navigate('/users', {replace: true}); findAllUsers()}}} onChange={(e) => {setSearchKeyword(e.target.value)}} placeholder='검색어를 입력하세요'></input>
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
              {auth.role && auth.role === "ROLES_OWNER" && (
                <>
                  <th className="border border-gray-300 px-4 py-2">지점</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {userList && userList.length > 0 ? (
              userList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50" onClick={() => {window.open(`/userinfo/${user.id}`, '_blank', 'width=600,height=400,top=100,left=100')}}>
                  <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.telNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.birth}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.createAt ? new Date(user.createAt).toLocaleString() : ''}
                  </td>
                  {auth.role && auth.role === "ROLES_OWNER" && (
                    <>
                      <td className="border border-gray-300 px-4 py-2" id={JSON.stringify(user.branchId)}>
                        {user.branchName}
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-300 px-4 py-2 text-center"
                  colSpan={9}
                >
                  회원이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='flex justify-center my-3'>
        <ul className='flex'>
        {(userList && userList.length > 0) && (
          <>
            {(page - 1) <= 0 ? (
              <span className="p-2 rounded-lg cursor-not-allowed font-bold text-gray-300">＜</span>
            ) : (
              <span className="p-2 rounded-lg hover:bg-gray-200 font-bold text-gray-500" onClick={() => {setPage(page - 1); setPageBtn(!pageBtn)}}>＜</span>
            )}
            {pagination()}
            {(page + 1) > totalPage ? (
              <span className="p-2 rounded-lg cursor-not-allowed font-bold text-gray-300">＞</span>
            ) : (
              <span className="p-2 rounded-lg hover:bg-gray-200 font-bold text-gray-500" onClick={() => {setPage(page + 1); setPageBtn(!pageBtn)}}>＞</span>
            )}
          </>
        )}
        </ul>
      </div>
    </Card>
  );
};

export default UserList;
