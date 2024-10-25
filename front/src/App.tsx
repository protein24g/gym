import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import OAuthSignUpPage from './pages/OAuthSignUpPage'
import Layout from './components/layout/Layout'
import Dashboard from './components/sidebar/Dashboard'
import { useEffect, useState } from 'react'
import { SidebarContext } from './context/SidebarContext'
import { AuthContext } from './context/AuthContext'
import Users from './components/sidebar/member_management/Users'
import Managers from './components/sidebar/member_management/Managers'
import Trainers from './components/sidebar/member_management/Trainers'
import MyPage from './components/sidebar/my-page/MyPage'
import axios from 'axios'

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  const toggleSidebar = (): void => {
    setSidebarOpen(!isSidebarOpen);
  }

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
    <BrowserRouter>
      <SidebarContext.Provider value={{isSidebarOpen, toggleSidebar}}>
        <AuthContext.Provider value={{ role, setRole }}>
          <Routes>
            <Route element={<Layout imageSrc={imageSrc}/>}>
              <Route path='/dashboard' element={<Dashboard/>}></Route>
              <Route path='/managers' element={<Managers/>}></Route>
              <Route path='/trainers' element={<Trainers/>}></Route>
              <Route path='/users' element={<Users/>}></Route>
              <Route path='/my-page' element={<MyPage/>}></Route>
            </Route>
            <Route path='/auth/signin' element={<SignInPage/>}></Route>
            <Route path='/auth/signup' element={<SignUpPage/>}></Route>
            <Route path='/oauth-signup' element={<OAuthSignUpPage/>}></Route>
          </Routes>
        </AuthContext.Provider>
      </SidebarContext.Provider>
    </BrowserRouter>
  )
}

export default App
