import { FC } from 'react'
import { MdAdminPanelSettings } from "react-icons/md";
import { RiKakaoTalkFill } from "react-icons/ri";

const SignInPage: FC = () => {
  return (
    <div className='flex min-h-screen justify-center items-center'>
      <div className='w-full sm:max-w-lg p-3 border-2 rounded-md'>
        <div className='my-3'>
          <MdAdminPanelSettings className='w-full h-24'/>
        </div>
        <div className='my-3'>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            관리자 로그인
          </h2>
          <div className='my-3'>
            <input className='px-2 py-3 w-full bg-transparent border-b-2' type='text' placeholder='example@email.com'></input>
          </div>
          <div className='my-3'>
            <input className='px-2 py-3 w-full bg-transparent border-b-2' type='password' placeholder='●●●●●●●●'></input>
          </div>
          <button className='px-2 py-3 w-full bg-blue-500 text-bold text-white' type='submit'>로그인</button>
          <button className='flex justify-center px-2 py-3 my-3 w-full bg-yellow-300 text-bold text-black' type='submit'>
            <RiKakaoTalkFill className='relative top-1 right-1'/>카카오로 시작하기
            </button>
        </div>
        <div className='my-3'>

        </div>
      </div>
    </div>
  )
}

export default SignInPage
