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
      <div className="flex relative flex-wrap justify-evenly">
        {branchList.map((branch) => (
          <div
            key={branch.id}
            onClick={() => {setSelectedBranch(branch); setIsDialogOpen(true)}}
            className="m-4 p-6 pr-0 bg-white shadow-[0px_0px_20px_10px_rgba(0,0,0,0.1)] w-80 min-w-sm h-44 border hover:border-gray-500 cursor-pointer"
          >
            <div className="flex relative flex-1 h-full">
              <div className="absolute right-2 -top-4">
                <HiMinusCircle
                  className="text-red-500 w-6 h-6"
                  onClick={() => {deleteBranch(branch.id)}}
                />
              </div>
              <div className="w-full flex flex-col">
                <div className="flex-1">
                  <p className="font-bold text-lg">{branch.managerName}</p>
                  <p className="text-xs">{branch.branchName}</p>
                </div>
                <div className="text-xs">
                  <p>{branch.email}</p>
                  <p>{branch.telNumber}</p>
                  <p>{branch.address}</p>
                </div>
              </div>
              <div className="w-full h-full flex items-center">
                <img src={logoImageWhite1} className="w-full h-full" alt="logo" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {isDialogOpen && selectedBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">지점 정보</h2>
            <p><strong>지점 이름:</strong> {selectedBranch.branchName}</p>
            <p><strong>매니저 이름:</strong> {selectedBranch.managerName}</p>
            <p><strong>이메일:</strong> {selectedBranch.email}</p>
            <p><strong>전화번호:</strong> {selectedBranch.telNumber}</p>
            <p><strong>주소:</strong> {selectedBranch.address}</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => {setSelectedBranch(null); setIsDialogOpen(false)}}
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
