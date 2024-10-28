import { FC, useContext, useEffect, useState } from "react"
import { CiSearch } from "react-icons/ci"
import { RxHamburgerMenu } from "react-icons/rx"
import { SidebarContext } from "../../context/SidebarContext";
import { CgProfile } from "react-icons/cg";
import axios from "axios";

const Header: FC = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  const getMyProfileImage = async () => {
    const response = await axios.get('http://localhost:3000/api/mypage/profile/image', {
      withCredentials: true,
    });

    if (response.status === 200) {
      setImageSrc(response.data);
    }
  };

  useEffect(() => {
    getMyProfileImage();
  }, []);

  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center">
      <div className="flex flex-1 items-center">
        <RxHamburgerMenu className="cursor-pointer mr-4" onClick={toggleSidebar} />
        <div className="relative w-full">
          <input type="text" placeholder="Search..." className="text-sm focus:outline-none w-3/4 md:w-2/5 h-10 border border-gray-400 rounded-sm px-4 pl-7"></input>
          <CiSearch className="absolute left-2 top-3"/>
        </div>
      </div>
      <div>
        {imageSrc ? <img src={imageSrc} alt="Profile" className="w-10 h-10 rounded-full" /> : <CgProfile className="w-10 h-10 rounded-full"/>}
      </div>
    </div>
  )
}

export default Header;
