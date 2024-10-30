import { FC, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const AuthRoute: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/check-token', { withCredentials: true });
        if (response.status === 200) {
          navigate('/');
        }
      } catch(error) {
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  if (!isLoading) return <Outlet />;
};

export default AuthRoute;
