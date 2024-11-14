import { FC, useState } from "react"
import LogoImage1 from '../../assets/logoImage-1.png'
import axios, { AxiosError } from "axios";

const AttendanceCheckPage: FC = () => {
  const btnAry: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '초기화', '0', '삭제']
  const [telNumber, settelNumber] = useState<string>('010');

  const btnClick = (num: string) => {
    if (num === '초기화') {
      settelNumber('010');
    } else if (num === '삭제') {
      settelNumber(telNumber.slice(0, -1));
    } else if (!isNaN(Number(num))) {
      settelNumber(telNumber + num);
    }
  };

  const checkIn = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/attendances',
        {
          telNumber
        },
        {withCredentials: true}
      );

      if (response.status === 201) {
        alert('출석체크 성공');

      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const data = axiosError.response?.data as {message: string};
      alert(data.message);
    } finally {
      settelNumber('010');
    }
  }

  return (
    <div className='flex min-h-screen justify-center items-center bg-custom-gray text-white'>
      <div className="text-white text-center text-xl font-bold p-10 shadow-2xl">
        {/* 사이트 로고 */}
        <img src={LogoImage1} className='mx-auto max-w-72'/>
        <div className="my-4">
          <input type='text' className="w-full p-4 text-black focus:outline-none" value={telNumber} onChange={(e) => settelNumber(e.target.value)}/>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {btnAry.map((num) => 
            (
              <div key={num} onClick={() => (btnClick(num))} className="flex justify-center items-center bg-gradient-to-br hover:from-gray-400 hover:to-gray-300 from-gray-600 to-gray-400 p-4 md:p-6 rounded-lg cursor-pointer transition-transform transform hover:scale-105">
                {num}
              </div>
            ))
          }
        </div>
        <div
          onClick={() => checkIn()}
          className="flex justify-center items-center my-4 hover:bg-blue-400 bg-blue-500 p-4 text-xl font-bold rounded-lg cursor-pointer"
        >
          출석체크
        </div>
      </div>
    </div>
  )
}

export default AttendanceCheckPage
