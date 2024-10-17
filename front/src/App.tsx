import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignInPage from './pages/SignInPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<SignInPage />}></Route>
        <Route path='/signup' element={<SignInPage />}></Route>
        <Route path='/admin' element={<SignInPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
