import { FC, useState } from 'react';
import LogoImage1 from '../assets/logoImage-1.png';
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { RiKakaoTalkFill } from 'react-icons/ri';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authState } from '../recoil/AuthState';
import { useRecoilState } from 'recoil';
import { FaUserLock } from 'react-icons/fa';

const SignInPage: FC = () => {
  const SESSION_DURATION = 60 * 60 * 1000; // 1h
  
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();
  const [, setAuth] = useRecoilState(authState);

  const signIn = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // 기본 폼 제출 방지
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signin',
        {
          email,
          password
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setAuth({isAuthenticated: true, role: response.data.role});
        sessionStorage.setItem('expiresAt', JSON.stringify(Date.now() + SESSION_DURATION));
        navigate('/');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const res = error.response?.data.message;
        const status = error.response?.status;

        if (status === 400) {
          alert(Object.values(res[0].constraints).join(''));
        } else if (status === 401) {
          alert(error.response?.data.message);
        } else if (status === 403) {
          setAuth({isAuthenticated: true, role: error.response?.data.role});
          alert(error.response?.data.message);
          sessionStorage.setItem('expiresAt', JSON.stringify(Date.now() + SESSION_DURATION));
          navigate('/my-page');
        }
      }
    }
  } 

  return (
    <div className='flex min-h-screen justify-center items-center bg-custom-gray text-white'>
      <div className='w-full sm:max-w-lg p-3'>
        {/* 회원가입 폼 */}
        <form onSubmit={signIn} className='p-10 shadow-2xl'>
          {/* 사이트 로고 */}
          <img src={LogoImage1} className='mx-auto max-w-72'/>
          <div className='flex items-center gap-2'>
            <FaUserLock className='w-6 h-6'/>
            <h1 className='text-2xl font-bold'>로그인</h1>
          </div>
          <hr className='border border-gray-400 my-3'></hr>
          {/* 이메일 */}
          <div className='my-3'>
            <div className='mb-2'>
              <label htmlFor='email'>이메일</label>
              <span className='text-red-500'>*</span>
            </div>
            <input className='p-2 w-full border text-black rounded' placeholder='이메일을 입력해주세요' id='email' type='email' onChange={(e) => setEmail(e.target.value)} value={email} required/>
          </div>
          {/* 비밀번호 */}
          <div className='my-3 relative'>
            <div className='mb-2'>
              <label htmlFor='password'>비밀번호</label>
              <span className='text-red-500'>*</span>
            </div>
            <input className='p-2 w-full border text-black rounded' placeholder='비밀번호를 입력해주세요' id='password' type={isPasswordVisible ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} value={password} required/>
            {isPasswordVisible ? 
              <IoEyeOutline className='absolute right-4 bottom-2 w-6 h-6 text-black cursor-pointer' onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}/>
            :
              <IoEyeOffOutline className='absolute right-4 bottom-2 w-6 h-6 text-black cursor-pointer' onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}/>
            }
          </div>
          {/* 비밀번호 찾기 */}
          <div className='my-2 flex justify-end'>
            <a className='mb-4 text-sm' href='#'>비밀번호 찾기</a>
          </div>
          {/* 로그인 버튼 */}
          <div className='my-3'>
            <button className='p-2 w-full bg-blue-500 font-bold text-white hover:bg-blue-600 rounded border border-transparent' type='submit'>로그인</button>
          </div>
          <div className='my-2 grid grid-cols-3 items-center'>
            <hr className='border border-gray-400'/>
            <p className='text-center'>OR</p>
            <hr className='border border-gray-400'/>
          </div>
          <button className='flex justify-center p-2 rounded border border-transparent w-full bg-yellow-300 font-bold text-black hover:bg-yellow-200' onClick={() => {window.location.href = 'http://localhost:3000/api/kakao/oauth/authorize';}} type='button'>
            <RiKakaoTalkFill className='relative right-2 w-6 h-6'/>카카오계정으로 시작하기
          </button>
          <div className='my-3'>
            <span>계정이 없으신가요?</span>
            <a className='mx-3 text-blue-500 font-bold' href='http://localhost:5173/auth/signup'>회원가입</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignInPage