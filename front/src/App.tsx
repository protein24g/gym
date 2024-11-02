import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';
import { SidebarContext } from './context/SidebarContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/sidebar/Dashboard';
import Managers from './pages/sidebar/Managers';
import MyPage from './pages/sidebar/MyPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OAuthSignUpPage from './pages/OAuthSignUpPage';
import NotFound from './pages/NotFound';
import Trainers from './pages/sidebar/Trainers';
import Users from './pages/sidebar/Users';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <RecoilRoot>
      <BrowserRouter>
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
          <Routes>
            <Route element={<Layout roles={["ROLES_OWNER", "ROLES_MANAGER", "ROLES_TRAINER"]} />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='/my-page' element={<MyPage />} />
              <Route path='/users' element={<Users />} />
            </Route>
            {/* Trainers 페이지에 대한 권한 설정 */}
            <Route element={<Layout roles={["ROLES_OWNER", "ROLES_MANAGER"]} />}>
              <Route path='/trainers' element={<Trainers />} />
            </Route>
            {/* Users 페이지에 대한 권한 설정 */}
            <Route element={<Layout roles={["ROLES_OWNER"]} />}>
              <Route path='/managers' element={<Managers />} />
            </Route>
            {/* 기타 페이지 */}
            <Route path='auth'>
              <Route path='signin' element={<SignInPage />} />
              <Route path='signup' element={<SignUpPage />} />
              <Route path='oauth-signup' element={<OAuthSignUpPage />} />
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </SidebarContext.Provider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
