import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import OAuthSignUpPage from './pages/OAuthSignUpPage'
import Layout from './components/Layout/Layout'
import Dashboard from './components/Dashboard'
import Providers from './components/Providers'
import { useState } from 'react'
import { SidebarContext } from './context/SidebarContext'

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = (): void => {
    setSidebarOpen(!isSidebarOpen);
  }

  return (
    <BrowserRouter>
      <SidebarContext.Provider value={{isSidebarOpen, toggleSidebar}}>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route path='/dashboard' element={<Dashboard/>}></Route>
            <Route path='/providers' element={<Providers/>}></Route>
          </Route>
          <Route path='/signin' element={<SignInPage/>}></Route>
          <Route path='/signup' element={<SignUpPage/>}></Route>
          <Route path='/oauth-signup' element={<OAuthSignUpPage/>}></Route>
        </Routes>
      </SidebarContext.Provider>
    </BrowserRouter>
  )
}

export default App
