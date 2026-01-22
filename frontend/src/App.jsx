import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import CompanyEmploye from './pages/CompanyEmploye'
import JudicialEmploye from './pages/JudicialEmploye'
import AddEmployee from './pages/AddEmployee'
import AnnualAbsence from './pages/AnnualAbsence'
import EmployeePage from './pages/EmployeePage'
import Documents from './pages/Documents'
import GeneratedPage from './pages/GeneratedPage'
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/companyEmploye/:id' element={<CompanyEmploye />} />
        <Route path='/judicialEmploye/:id' element={<JudicialEmploye />} />
        <Route path='/addEmploye' element={<AddEmployee />} />
        <Route path='/employeePage' element={<EmployeePage />} />
        <Route path='/anualAbsence' element={<AnnualAbsence />} />
        <Route path='/documents' element={<Documents />} />
        <Route path='/generate' element={<GeneratedPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
