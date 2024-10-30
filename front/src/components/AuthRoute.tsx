import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const AuthRoute: FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-token', {
          withCredentials: true
        });
        if (response.status === 200) {
          navigate('/');
        }
      } catch(error) {
      }
    };
  
    checkToken();
  }, []);

  return <Outlet />;
};

export default AuthRoute;
