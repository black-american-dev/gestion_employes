import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import Employe from './pages/Employe'
import EmployeeForm from './components/EmployeeForm'
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/employe/:id' element={<Employe />} />
        <Route path='/addEmploye' element={<EmployeeForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
