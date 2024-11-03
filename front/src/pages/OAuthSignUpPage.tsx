import { FC, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import LogoImage1 from '../assets/logoImage-1.png';
import { FaUserPlus } from 'react-icons/fa';

interface Branch {
  id: number;
  name: string;
}

const OAuthSignUpPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [branchId, setBranchId] = useState<string | null>(null);
  const [branchList, setBranchList] = useState<Branch[]>([]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/kakao/oauth/verify-token', {}, { withCredentials: true });

        if (response.status === 200) {
          setIsLoading(false);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        alert(axiosError.message === 'Request failed with status code 401' ? '잘못된 토큰입니다' : '알 수 없는 오류');
        window.location.href = 'http://localhost:5173/auth/signin';
      }
    };

    const findAllBranches = async () => {
      try {
        const response = await axios.get<Branch[]>('http://localhost:3000/api/branches');
        setBranchList(response.data); // 상태에 배열 저장
      } catch (error) {
        alert('지점 목록을 불러오는 중 오류 발생: ' + error);
      }
    };

    verifyToken();
    findAllBranches();
  }, []);

  const signUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // 기본 폼 제출 방지
    if (!confirm('가입 하시겠습니까?')) return;
    if (branchId === null || isNaN(Number(branchId))) {
      alert('지점을 선택하세요');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/kakao/oauth/signup',
        { branchId, email, telNumber, birth },
        { withCredentials: true }
      );
  
      if (response.status === 201) {
        alert(response.data.message);
        window.location.href = 'http://localhost:5173/auth/signin';
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const res = error.response?.data.message;
        if (typeof res === 'string') {
          alert(res);
        } else {
          alert(Object.values(res[0].constraints).join(''));
        }
      }
    }
  };

  if (isLoading) {
    return;
  }

  return (
    <div className='flex min-h-screen justify-center items-center bg-custom-gray text-white'>
      <div className='w-full sm:max-w-lg p-3'>
        {/* 회원가입 폼 */}
        <form onSubmit={signUp} className='px-10 py-4 shadow-2xl'>
          {/* 사이트 로고 */}
          <img src={LogoImage1} className='mx-auto max-w-72'/>
          <div className='flex items-center gap-2'>
            <FaUserPlus className='w-6 h-6'/>
            <h1 className='text-2xl font-bold text-yellow-500'>카카오계정 회원가입</h1>
          </div>
          <hr className='border border-gray-400 my-3'></hr>
          {/* 지점 */}
          <div className='my-3'>
            <select className='bg-transparent text-white text-sm border rounded w-full p-2.5' name='branch' onChange={(e) => {setBranchId(e.target.value)}}>
              <option className='text-black'>지점을 선택하세요</option>
              {branchList && (
                branchList.map((branch) => (
                  <option className='text-black' key={branch.id} value={branch.id}>{branch.name}</option>
                ))
              )}
            </select>
          </div>
          {/* 이메일 */}
          <div className='my-3'>
            <div className='mb-2'>
              <label htmlFor='email'>이메일</label>
            </div>
            <input className='p-2 w-full border text-black rounded' id='email' placeholder='이메일을 입력해 주세요' type='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
          </div>
          {/* 연락처 */}
          <div className='my-3'>
            <div className='mb-2'>
              <label htmlFor='tel-number'>휴대폰</label>
              <span className='text-red-500'>*</span>
            </div>
            <input className='p-2 w-full border text-black rounded' id='tel-number' placeholder="'-' 없이 숫자만" type='text' onChange={(e) => setTelNumber(e.target.value)} value={telNumber} required/>
          </div>
          {/* 생년월일 */}
          <div className='my-3'>
            <div className='mb-2'>
              <label htmlFor='birth'>생년월일</label>
              <span className='text-red-500'>*</span>
            </div>
            <input className='p-2 w-full border text-black rounded' placeholder='YYMMDD' type='text' onChange={(e) => setBirth(e.target.value)} value={birth} required/>
          </div>
          {/* 회원가입 버튼 */}
          <div className='mt-10'>
            <button className='p-2 w-full border border-transparent font-bold rounded bg-yellow-400 hover:bg-yellow-300 text-black' type='submit'>회원가입</button>
          </div>
          <div className='my-3'>
            <span>이미 계정이 있으신가요?</span>
            <a className='mx-3 text-blue-500 font-bold' href='/auth/signin'>로그인</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OAuthSignUpPage