import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';
import { SidebarContext } from './context/SidebarContext';
import Layout from './components/layout/Layout';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OAuthSignUpPage from './pages/OAuthSignUpPage';
import NotFound from './pages/NotFound';
import OAuthCallback from './pages/OAuthCallback';
import DashboardPage from './pages/sidebar/DashboardPage';
import ManagersPage from './pages/managers/ManagersPage';
import UsersPage from './pages/sidebar/users/UsersPage';
import UserInfoPage from './pages/sidebar/users/UserInfoPage';
import TrainersPage from './pages/sidebar/trainers/TrainersPage';
import StudentsPage from './pages/students/StudentsPage';
import ManagerCrudPage from './pages/managers/ManagerCrudPage';
import MyPage from './pages/sidebar/MyPage';
import AttendanceCheckPage from './pages/attendance/AttendanceCheckPage';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const role = sessionStorage.getItem('role');

  const toggleSidebar = (): void => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <RecoilRoot>
      <BrowserRouter>
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
          <Routes>
            {role && JSON.parse(role) === "ROLES_USER" ? (
              <Route element={<Layout roles={["ROLES_USER"]} />}>
                <Route path='/' element={<MyPage />} />
                <Route path='/my-page' element={<MyPage />} />
              </Route>
            ) : (
              <>
                <Route element={<Layout roles={["ROLES_OWNER", "ROLES_MANAGER", "ROLES_TRAINER"]} />}>
                  <Route path='/' element={<DashboardPage />} />
                  <Route path='/my-page' element={<MyPage />} />
                  <Route path='/users' element={<UsersPage />} />
                </Route>
                {/* Trainers 페이지에 대한 권한 설정 */}
                <Route element={<Layout roles={["ROLES_OWNER", "ROLES_MANAGER"]} />}>
                  <Route path='/trainers' element={<TrainersPage />} />
                </Route>
                {/* Users 페이지에 대한 권한 설정 */}
                <Route element={<Layout roles={["ROLES_OWNER"]} />}>
                  <Route path='/managers' element={<ManagersPage />} />
                  <Route path='/managers/manage' element={<ManagerCrudPage />} />
                </Route>
                {/* Students 페이지에 대한 권한 설정 */}
                <Route element={<Layout roles={["ROLES_TRAINER"]} />}>
                  <Route path='/students' element={<StudentsPage />} />
                </Route>
                <Route path='/userinfo/:userId' element={<UserInfoPage roles={["ROLES_OWNER", "ROLES_MANAGER", "ROLES_TRAINER"]}/>} />
              </>
            )}
            
            {/* 기타 페이지 */}
            <Route path='auth'>
              <Route path='signin' element={<SignInPage />} />
              <Route path='signup' element={<SignUpPage />} />
              <Route path='oauth-signup' element={<OAuthSignUpPage />} />
              <Route path='oauth-callback' element={<OAuthCallback />} />
            </Route>
            <Route path='attendance-check' element={<AttendanceCheckPage />}></Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </SidebarContext.Provider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
