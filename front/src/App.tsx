import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { useState } from 'react';
import { RecoilRoot } from 'recoil';
import { SidebarContext } from './context/SidebarContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/sidebar/Dashboard';
import Managers from './pages/sidebar/Managers';
import Trainers from './pages/Trainers';
import Users from './pages/Users';
import MyPage from './pages/sidebar/MyPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OAuthSignUpPage from './pages/OAuthSignUpPage';
import NotFound from './pages/NotFound';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarOpen(!isSidebarOpen);
  }

  return (
    <RecoilRoot>
      <BrowserRouter>
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
          <Routes>
            <Route element={<ProtectedRoute requiredRoles={["ROLES_OWNER", "ROLES_MANAGER", "ROLES_TRAINER"]}><Layout /></ProtectedRoute>}>
              <Route path='/' element={<Dashboard />} />
              <Route path='/managers' element={<Managers />} />
              <Route path='/trainers' element={<Trainers />} />
              <Route path='/users' element={<Users />} />
              <Route path='/my-page' element={<MyPage />} />
            </Route>
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
  )
}

export default App
