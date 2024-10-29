import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import OAuthSignUpPage from './pages/OAuthSignUpPage'
import { useState } from 'react'
import { SidebarContext } from './context/SidebarContext'
import ProtectedRoute from './components/ProtectedRoute'
import { RecoilRoot } from 'recoil'
import Managers from './components/Sidebar/member_management/Managers'
import Layout from './components/Layout/Layout'
import Dashboard from './components/Sidebar/Dashboard'
import Trainers from './components/Sidebar/member_management/Trainers'
import Users from './components/Sidebar/member_management/Users'
import MyPage from './components/Sidebar/my-page/MyPage'

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = (): void => {
    setSidebarOpen(!isSidebarOpen);
  }

  return (
    <RecoilRoot>
      <BrowserRouter>
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
          <Routes>
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/managers' element={<Managers />} />
              <Route path='/trainers' element={<Trainers />} />
              <Route path='/users' element={<Users />} />
              <Route path='/my-page' element={<MyPage />} />
            </Route>
            <Route path='/auth/signin' element={<SignInPage />} />
            <Route path='/auth/signup' element={<SignUpPage />} />
            <Route path='/oauth-signup' element={<OAuthSignUpPage />} />
          </Routes>
        </SidebarContext.Provider>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
