import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import OAuthSignUpPage from './pages/OAuthSignUpPage'
import DashBoardPage from './pages/DashBoardPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<DashBoardPage/>}></Route>
      <Route path='/signin' element={<SignInPage/>}></Route>
      <Route path='/signup' element={<SignUpPage/>}></Route>
        <Route path='/oauth-signup' element={<OAuthSignUpPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
