import { Route, Routes } from 'react-router'
import Layout from './Layout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'

function App() {
  return (
    <>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Login />} />
          <Route element={<Layout />}>
            <Route path='/home' element={<Home />}/>
            <Route path='/profile' element={<Profile name="Pablo" />}/>
          </Route>
        </Routes>
    </>
  )
}

export default App
