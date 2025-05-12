import { Route, Routes } from 'react-router'
import Layout from './Layout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/home' element={<Home />}/>
            <Route path='/profile' element={<Profile name="Pablo" />}/>
          </Route>
        </Routes>
    </>
  )
}

export default App
