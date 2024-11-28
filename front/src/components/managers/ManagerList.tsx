import { FC, useEffect, useState } from "react";
import Card from "../ui/Card";
import Loading from "../loading/Loading";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import logoImageWhite1 from "../../assets/logoImage-1-white.png";
import { HiMinusCircle } from "react-icons/hi";

interface ManagerInfo {
  id: number;
  branchName: string;
  managerName: string;
  email: string;
  telNumber: string;
  address: string;
}

const ManagerList: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<ManagerInfo | null>(null);
  const navigate = useNavigate();

  const [branchList, setBranchList] = useState<ManagerInfo[]>([]);

  const [changeManagerId, setChangeManagerId] = useState<string>('');

  const changeBranch = async (prevUserId: number) => {
    try {
      const response = await axios.patch('http://localhost:3000/api/managers',
        {
          prevUserId,
          userId: changeManagerId,
          address: selectedBranch?.address,
        },
        {withCredentials: true}
      );

      if (response.status === 200) {
        alert('매니저 변경 성공');
        navigate("/managers");
      }

    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.status === 404) {
        alert('존재하지 않는 고유 ID');
      } else if (axiosError.status === 409) {
        alert('이미 지정된 매니저');
      }
    }
  }

  const findAllManagers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/branches", {
        withCredentials: true,
      });
      setBranchList(response.data);
      setIsLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError.message);
      navigate("/auth/signin");
    }
  };

  const deleteBranch = async (id: number) => {
    if (confirm("삭제 하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:3000/api/branches/${id}`, {
          withCredentials: true,
        });
        alert("삭제 성공");
        findAllManagers();
      } catch (error) {
        const axiosError = error as AxiosError;
        alert(axiosError.message);
      }
    }
  };

  useEffect(() => {
    findAllManagers();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <Card>
      <div className="text-lg font-bold">
        <span className="my-2">지점</span>
        <span>({branchList.length}개)</span>
      </div>
      <div className="flex flex-wrap justify-evenly">
        {branchList.map((branch) => (
          <div className="group relative">
            <div
              key={branch.id}
              onClick={() => {setSelectedBranch(branch); setIsDialogOpen(true)}}
              className="m-4 p-6 pr-0 bg-white shadow-[0px_0px_20px_10px_rgba(0,0,0,0.1)] w-96 h-52 min-w-sm border hover:border-gray-500 cursor-pointer"
            >
              <div className="flex flex-1 h-full">
                <div className="w-full flex flex-col text-xs gap-4">
                  <div>
                    <p>점장</p>
                    <p className="font-bold text-lg">{branch.managerName}</p>
                  </div>
                  <div>
                    <p>
                      <span className="font-bold">Tel. </span>
                      <span>{branch.telNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</span>
                    </p>
                    <p>
                      <span className="font-bold">Email. </span>
                      <span>{branch.email}</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">{branch.branchName}</p>
                    <p>{branch.address}</p>
                  </div>
                </div>
                <div className="w-full h-full flex items-center">
                  <img src={logoImageWhite1} className="w-full h-full" alt="logo" />
                </div>
              </div>
            </div>
            <div className="absolute right-6 top-6 hidden group-hover:block">
              <HiMinusCircle
                className="text-red-500 w-6 h-6 hidden group-hover:block"
                onClick={() => {deleteBranch(branch.id)}}
              />
            </div>
          </div>
        ))}
      </div>
      {isDialogOpen && selectedBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-lg">
            <h2 className="text-lg font-bold mb-6 text-center">지점 정보 수정</h2>
            <form className="space-y-4">
              {/* 지점 이름 */}
              <div className="flex flex-col">
                <label htmlFor="name" className="font-bold text-sm text-gray-700">지점 이름:</label>
                <input 
                  className="border bg-gray-200 text-gray-500 p-2 rounded-md cursor-not-allowed" 
                  id="name" 
                  type="text" 
                  disabled 
                  value={selectedBranch.branchName || ''} 
                />
              </div>

              {/* 매니저 고유 ID */}
              <div className="flex flex-col">
                <label htmlFor="userId" className="font-bold text-sm text-gray-700">매니저 고유 ID:</label>
                <input 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  id="userId" 
                  type="text" 
                  value={changeManagerId} 
                  onChange={(e) => setChangeManagerId(e.target.value)}  // 수정 가능
                  placeholder="매니저 변경시 고유 ID 를 입력하세요"
                />
              </div>

              {/* 전화번호 */}
              <div className="flex flex-col">
                <label htmlFor="telNumber" className="font-bold text-sm text-gray-700">Tel:</label>
                <input 
                  className="border bg-gray-200 text-gray-500 p-2 rounded-md cursor-not-allowed" 
                  id="telNumber" 
                  type="text" 
                  disabled 
                  value={selectedBranch.telNumber || ''} 
                />
              </div>

              {/* 이메일 */}
              <div className="flex flex-col">
                <label htmlFor="email" className="font-bold text-sm text-gray-700">Email:</label>
                <input 
                  className="border bg-gray-200 text-gray-500 p-2 rounded-md cursor-not-allowed" 
                  id="email" 
                  type="text" 
                  disabled 
                  value={selectedBranch.email || ''} 
                />
              </div>

              {/* 주소 */}
              <div className="flex flex-col">
                <label htmlFor="address" className="font-bold text-sm text-gray-700">주소:</label>
                <input 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  id="address" 
                  type="text" 
                  value={selectedBranch.address} 
                  onChange={(e) => setSelectedBranch({...selectedBranch, address: e.target.value})}  // 수정 가능
                />
              </div>
            </form>
            
            <div className="flex justify-end mt-6 gap-2">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-all"
                onClick={() => {
                  if (confirm('수정 하시겠습니까?')) {
                    changeBranch(selectedBranch.id);
                  }
                }}
              >
                수정
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-all"
                onClick={() => { setSelectedBranch(null); setIsDialogOpen(false); setChangeManagerId(''); }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ManagerList;
