import { FC, useEffect, useState } from 'react';
import axios from 'axios';

const OAuthSignUpPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [telNumber, setTelNumber] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/kakao/oauth/verify-token',
          {},
          { 
            withCredentials: true,
          }
        );

        if (!response.data.success) {
          alert('잘못된 접근입니다');
          window.location.href = 'http://localhost:5173/signin';
        }

        setIsLoading(!isLoading);
      } catch (error) {
        alert('토큰 검증 중 오류 발생: ' + error);
        window.location.href = 'http://localhost:5173/signin';
      }
    };

    verifyToken();
  }, []);

  const signUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // 기본 폼 제출 방지
    if (!confirm('가입 하시겠습니까?')) return;
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

  if (isLoading) {
    return;
  }
  return (
    <div className='flex min-h-screen justify-center items-center bg-custom-gray text-white'>
      <div className='w-full sm:max-w-lg p-3'>
        {/* 회원가입 폼 */}
        <form onSubmit={signUp} className='p-10 shadow-2xl rounded'>
          <div className='text-2xl font-semibold mb-5 text-center text-yellow-400'>카카오 회원가입 추가정보</div>
          {/* 연락처 */}
          <div className='my-3'>
            <div className='mb-2'>
              <label htmlFor='tel-number'>휴대폰</label>
              <span className='text-red-500'>*</span>
            </div>
            <input className='p-2 w-full border text-black rounded' id='tel-number' placeholder="'-' 없이 숫자만" type='text' onChange={(e) => setTelNumber(e.target.value)} value={telNumber}/>
          </div>
          {/* 생년월일 */}
          <div className='my-3'>
            <div className='mb-2'>
              <label htmlFor='birth'>생년월일</label>
              <span className='text-red-500'>*</span>
            </div>
            <input className='p-2 w-full border text-black rounded' placeholder='YYMMDD' type='text' onChange={(e) => setBirth(e.target.value)} value={birth}/>
          </div>
          {/* 주소 */}
          <div className='my-3'>
            <div className='mb-2'>
              <label htmlFor='address'>주소</label>
              <span className='text-red-500'>*</span>
            </div>
            <input className='p-2 w-full border text-black rounded' id='address' placeholder='주소' type='text' onChange={(e) => setAddress(e.target.value)} value={address}/>
          </div>
          {/* 상세 주소 */}
          <div className='my-3'>
            <input className='p-2 w-full border text-black rounded' id='address-detail' placeholder='상세 주소' type='text' onChange={(e) => setAddressDetail(e.target.value)} value={addressDetail}/>
          </div>
          {/* 회원가입 버튼 */}
          <div className='mt-10'>
            <button className='p-2 w-full border border-transparent font-bold rounded bg-yellow-400 hover:bg-yellow-300 text-black' type='submit'>회원가입</button>
          </div>
          <div className='my-3'>
            <span>이미 계정이 있으신가요?</span>
            <a className='mx-3 text-blue-500 font-bold' href='/signin'>로그인</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OAuthSignUpPage