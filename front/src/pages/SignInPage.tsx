import { FC, useState } from 'react';
import LogoImage from '../assets/logo.png';
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { RiKakaoTalkFill } from 'react-icons/ri';
import axios from 'axios';
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";

const SignInPage: FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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
        window.location.href = 'http://localhost:5173/';
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
  }

  return (
    <div className='flex min-h-screen justify-center items-center bg-custom-gray text-white'>
      <div className='w-full sm:max-w-lg p-3'>
        {/* 사이트 로고 */}
        <div className='my-2'>
          <img src={LogoImage} className='mx-auto max-w-xs'/>
        </div>
        {/* 로그인 폼 */}
        <form onSubmit={signIn}>
          {/* 이메일 */}
          <div className='flex my-2'>
            <div className='flex items-center justify-center'><AiOutlineMail className='w-12 h-12 p-2 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='이메일' id='email' type='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
          </div>
          {/* 비밀번호 */}
          <div className='flex my-2 relative'>
            <div className='flex items-center justify-center'><RiLockPasswordLine className='w-12 h-12 p-2 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='비밀번호' id='password' type={isPasswordVisible ? 'text' : 'password'} onChange={(e) => {setPassword(e.target.value)}} value={password}/>
            {isPasswordVisible ? 
              <IoEyeOutline className='absolute right-4 top-3 w-6 h-6 text-black cursor-pointer' onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}/>
            :
              <IoEyeOffOutline className='absolute right-4 top-3 w-6 h-6 text-black cursor-pointer' onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}/>
            }
          </div>
          {/* 비밀번호 찾기 */}
          <div className='my-2 flex justify-end'>
            <a className='mb-4 text-sm' href='#'>비밀번호 찾기</a>
          </div>
          {/* 로그인 버튼 */}
          <div className='my-2'>
            <button className='px-2 py-3 w-full bg-emerald-600 font-bold text-white hover:bg-emerald-500' type='submit'>로그인</button>
            <div className='my-2 grid grid-cols-3 items-center'>
              <hr className='broder-gray-400'/>
              <p className='text-center'>OR</p>
              <hr className='broder-gray-400'/>
            </div>
            <button className='flex justify-center px-2 py-3 w-full bg-yellow-300 font-bold text-black hover:bg-yellow-200' onClick={() => {window.location.href = 'http://localhost:3000/api/kakao/oauth/authorize';}} type='button'>
              <RiKakaoTalkFill className='relative top-1 right-1'/>카카오로 시작하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignInPage;
