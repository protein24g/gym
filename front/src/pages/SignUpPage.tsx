import { FC, useState } from 'react';
import LogoImage from '../assets/logo.png';
import { IoEyeOutline, IoImageOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import axios from 'axios';
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { RiLockPasswordFill } from "react-icons/ri";
import { GoPerson } from "react-icons/go";
import { BsTelephone } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { GrMap } from "react-icons/gr";
import { GrMapLocation } from "react-icons/gr";

const SignUpPage: FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isPasswordChkVisible, setIsPasswordChkVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordChk, setPasswordChk] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const signUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // 기본 폼 제출 방지
  
    try {
      const formData = new FormData(); // FormData 객체 생성
      formData.append('email', email);
      formData.append('password', password);
      formData.append('passwordChk', passwordChk);
      formData.append('name', name);
      formData.append('telNumber', telNumber);
      formData.append('birth', birth);
      formData.append('address', address);
      formData.append('addressDetail', addressDetail);
  
      if (profileImage) {
        formData.append('profileImage', profileImage); // 파일 첨부
      }
  
      const response = await axios.post('http://localhost:3000/api/auth/signup',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
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
          {/* 이메일 */}
          <div className='flex my-2'>
            <div className='flex items-center justify-center'><AiOutlineMail className='w-12 h-12 p-2 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='이메일' type='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
          </div>
          {/* 비밀번호 */}
          <div className='flex my-2 relative'>
            <div className='flex items-center justify-center'><RiLockPasswordLine className='w-12 h-12 p-2 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='비밀번호' type={isPasswordVisible ? 'text' : 'password'} onChange={(e) => {setPassword(e.target.value)}} value={password}/>
            {isPasswordVisible ? 
              <IoEyeOutline className='absolute right-4 top-3 w-6 h-6 text-black cursor-pointer' onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}/>
            :
              <IoEyeOffOutline className='absolute right-4 top-3 w-6 h-6 text-black cursor-pointer' onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}/>
            }
          </div>
          {/* 비밀번호 확인*/}
          <div className='flex my-2 relative'>
            <div className='flex items-center justify-center'><RiLockPasswordFill className='w-12 h-12 p-2 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='비밀번호 확인' type={isPasswordChkVisible ? 'text' : 'password'} onChange={(e) => {setPasswordChk(e.target.value)}} value={passwordChk}/>
            {isPasswordChkVisible ? 
              <IoEyeOutline className='absolute right-4 top-3 w-6 h-6 text-black cursor-pointer' onClick={() => {setIsPasswordChkVisible(!isPasswordChkVisible)}}/>
            :
              <IoEyeOffOutline className='absolute right-4 top-3 w-6 h-6 text-black cursor-pointer' onClick={() => {setIsPasswordChkVisible(!isPasswordChkVisible)}}/>
            }
          </div>
          {/* 이름 */}
          <div className='flex my-2'>
            <div className='flex items-center justify-center'><GoPerson className='w-12 h-12 p-2 bg-white text-gray-500 border-r'/></div>
            <input className='px-2 py-3 w-full bg-white text-black' placeholder='이름' type='text' onChange={(e) => setName(e.target.value)} value={name}/>
          </div>
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
          {/* 프로필 이미지 */}
          <div className='flex my-2'>
            <div className='flex items-center justify-center'><IoImageOutline  className='w-12 h-12 p-2 bg-white text-gray-500 border-r'/></div>
            <input className='p-2 w-full bg-white text-black' type='file' accept='image/*' name='profileImage' onChange={(e) => setProfileImage(e.target.files?.[0] || null)}/>
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

export default SignUpPage;
