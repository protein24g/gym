import { ChangeEvent, FC, useEffect, useState } from 'react';
import LogoImage1 from '../assets/logoImage-1.png';
import { IoEyeOffOutline, IoEyeOutline, IoPersonCircleSharp } from "react-icons/io5";
import axios from 'axios';
import { FaCamera, FaUserPlus } from 'react-icons/fa';

interface Branch {
  id: number;
  name: string;
}

const SignUpPage: FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 이미지 미리보기 상태
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [branchId, setBranchId] = useState<string | null>(null);
  const [branchList, setBranchList] = useState<Branch[]>([]);

  const signUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // 기본 폼 제출 방지

    if (!confirm('가입 하시겠습니까?')) return;
    try {
      const formData = new FormData(); // FormData 객체 생성
      if (branchId !== null && !isNaN(Number(branchId))) {
        formData.append('branchId', branchId);
      } else {
        alert('지점을 선택하세요');
        return;
      }
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('telNumber', telNumber);
      formData.append('birth', birth);
  
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

  const changeProfile = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      setProfileImage(file);
      const reader = new FileReader();

      // 파일이 로드된 후 실행될 함수
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string); // 이미지 미리보기 업데이트
      };

      // 파일 읽기
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null); // 파일이 없으면 미리보기 제거
    }
  }

  useEffect(() => {
    const findAllBranches = async () => {
      try {
        const response = await axios.get<Branch[]>('http://localhost:3000/api/branches');
        setBranchList(response.data); // 상태에 배열 저장
      } catch (error) {
        alert('지점 목록을 불러오는 중 오류 발생: ' + error);
      }
    };

    findAllBranches();
  }, []);

  return (
    <div className='flex min-h-screen justify-center items-center bg-custom-gray text-white'>
      <div className='w-full sm:max-w-lg p-3'>
        {/* 회원가입 폼 */}
        <form onSubmit={signUp} className='px-10 py-4 shadow-2xl'>
          {/* 사이트 로고 */}
          <img src={LogoImage1} className='mx-auto max-w-72'/>
          <div className='flex items-center gap-2'>
            <FaUserPlus className='w-6 h-6'/>
            <h1 className='text-2xl font-bold'>회원가입</h1>
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
          {/* 프로필 이미지 */}
          <div className='my-3'>
            <div className='relative w-24 h-24 mx-auto'>
              <label className='cursor-pointer'>
                {imagePreview ? (
                  <img src={imagePreview} id='change-profile' className='w-full h-full object-cover'/>
                ) : (
                  <IoPersonCircleSharp id='change-profile' className='w-full h-full'/> // 기본 아이콘
                )}
                <FaCamera className='absolute bottom-0 right-0 w-7 h-7'/>
                <input className='hidden' type="file" accept="image/*" onChange={changeProfile}/>
              </label>
            </div>
          </div>
          {/* 이름 */}
          <div className='my-3'>
            <div className='mb-2'>
              <label htmlFor='name'>이름</label>
              <span className='text-red-500'>*</span>
            </div>
            <input className='p-2 w-full border text-black rounded' id='name' placeholder='이름을 입력해 주세요' type='text' onChange={(e) => setName(e.target.value)} value={name} required/>
          </div>
          {/* 이메일 */}
          <div className='my-3'>
            <div className='mb-2'>
              <label htmlFor='email'>이메일</label>
              <span className='text-red-500'>*</span>
            </div>
            <input className='p-2 w-full border text-black rounded' id='email' placeholder='이메일을 입력해 주세요' type='email' onChange={(e) => setEmail(e.target.value)} value={email} required/>
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
            <button className='p-2 w-full border border-transparent bg-blue-500 font-bold text-white hover:bg-blue-600 rounded' type='submit'>회원가입</button>
          </div>
          <div className='my-3'>
            <span>이미 계정이 있으신가요?</span>
            <a className='mx-3 text-blue-500 font-bold' href='http://localhost:5173/auth/signin'>로그인</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUpPage