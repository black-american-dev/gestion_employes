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
          <button className="btn" onClick={()=> navigate("/employeePage")}>EMPLOYEES</button>
          <button className="btn">GENERATE</button>
          <button className="btn" onClick={() => navigate("/documents")}>DOCUMENTS</button>
          <button className="btn" onClick={() => navigate("/anualAbsence")}>ANNUAL ABCENCE</button>
          <button className="btn">SETTINGS</button>
        </div>
        <SearchInput />
      </div>
    </header>
  )
}

export default NavbarHeader