import { FC, useState } from 'react';
import LogoImage from '../assets/logo.png';
import axios from 'axios';
import { BsTelephone } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { GrMap } from "react-icons/gr";
import { GrMapLocation } from "react-icons/gr";

const OAuthSignUpPage: FC = () => {
  const [telNumber, setTelNumber] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');

  const signUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // 기본 폼 제출 방지
  
    try {
      const response = await axios.post('http://localhost:3000/api/kakao/oauth/signup',
        {
          telNumber,
          birth,
          address,
          addressDetail      
        },
        {
          withCredentials: true,
        }
      );
  
      if (response.status === 201) {
        alert(response.data.message);
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
  };

  return (
    <div className='flex min-h-screen justify-center items-center bg-custom-gray text-white'>
      <div className='w-full sm:max-w-lg p-3'>
        {/* 사이트 로고 */}
        <div className='my-2'>
          <img src={LogoImage} className='mx-auto max-w-xs'/>
        </div>
        {/* 회원가입 폼 */}
        <form onSubmit={signUp}>
          {/* 연락처 */}
          <div className='flex my-2'>
            <div className='flex items-center justify-center'><BsTelephone className='w-12 h-12 p-3 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='연락처(01012345678)' type='text' onChange={(e) => setTelNumber(e.target.value)} value={telNumber}/>
          </div>
          {/* 생년월일 */}
          <div className='flex my-2'>
            <div className='flex items-center justify-center'><SlCalender className='w-12 h-12 p-3 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='생년월일(YYMMDD)' type='text' onChange={(e) => setBirth(e.target.value)} value={birth}/>
          </div>
          {/* 주소 */}
          <div className='flex my-2'>
            <div className='flex items-center justify-center'><GrMap className='w-12 h-12 p-2 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='주소' type='text' onChange={(e) => setAddress(e.target.value)} value={address}/>
          </div>
          {/* 상세 주소 */}
          <div className='flex my-2'>
            <div className='flex items-center justify-center'><GrMapLocation className='w-12 h-12 p-2 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='상세 주소' type='text' onChange={(e) => setAddressDetail(e.target.value)} value={addressDetail}/>
          </div>
          {/* 회원가입 버튼 */}
          <div className='my-2'>
            <button className='px-2 py-3 w-full bg-emerald-600 font-bold text-white hover:bg-emerald-500' type='submit'>회원가입</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OAuthSignUpPage
