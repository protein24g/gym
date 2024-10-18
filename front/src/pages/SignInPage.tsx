import { FC } from 'react';
import LogoImage from '../assets/logo.png';
import { RiKakaoTalkFill } from 'react-icons/ri';

const SignInPage: FC = () => {
  return (
    <div className='flex min-h-screen justify-center items-center bg-custom-gray text-white'>
      <div className='w-full sm:max-w-lg p-3'>
        {/* 사이트 로고 */}
        <div className='my-3'>
          <img src={LogoImage} />
        </div>
        {/* 로그인 폼 */}
        <form>
          {/* 이메일 */}
          <div className='my-3'>
            <div className='flex justify-between'>
              <div>
                <label htmlFor='email'>이메일</label>
              </div>
            </div>
            <input id='email' className='p-2 my-3 w-full bg-white border-b-2 rounded-md' type='text' placeholder='example@email.com' />
          </div>
          {/* 비밀번호 */}
          <div className='my-3'>
            <div className='flex justify-between'>
              <div>
                <label htmlFor='email'>비밀번호</label>
              </div>
              <div>
                <a href=''>Forgat Password?</a>
              </div>
            </div>
            <input id='password' className='p-2 my-3 w-full bg-white border-b-2 rounded-md' type='password' placeholder='●●●●●●●●' />
          </div>
          {/* 로그인 버튼 */}
          <div className='my-3'>
            <button className='p-2 mt-3 w-full bg-emerald-600 font-bold text-white rounded-md' type='button'>로그인</button>
            <div className='my-3 grid grid-cols-3 items-center'>
              <hr className='broder-gray-400'/>
              <p className='text-center'>OR</p>
              <hr className='broder-gray-400'/>
            </div>
            <button className='flex justify-center p-2 my-3 w-full bg-yellow-300 font-bold text-black rounded-md' type='button'>
              <RiKakaoTalkFill className='relative top-1 right-1' />카카오로 시작하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
