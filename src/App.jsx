import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Home from './pages/Home.jsx'

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
