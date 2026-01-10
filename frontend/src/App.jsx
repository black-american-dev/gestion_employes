import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import Employe from './pages/Employe'
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/employe/:id' element={<Employe />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
