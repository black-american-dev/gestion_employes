import React from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from './SearchInput'

function NavbarHeader() {
    const navigate = useNavigate()

  return (
    <header className="header">
      <div className="nav-container">
        <div className="logo">
          <p onClick={()=> navigate("/")}>HR<span>Docs</span></p>
          <button className="btn" onClick={()=> navigate("/employeePage")}>Employee</button>
          <button className="btn" onClick={()=> navigate("/generate")}>Generate</button>
          <button className="btn" onClick={() => navigate("/documents")}>Documents</button>
          <button className="btn" onClick={() => navigate("/anualAbsence")}>Annual absence</button>
          <button className="btn" onClick={()=> navigate("/addEmploye")}>
                     Add Employee
                </button>
        </div>
        <SearchInput />
      </div>
    </header>
  )
}

export default NavbarHeader