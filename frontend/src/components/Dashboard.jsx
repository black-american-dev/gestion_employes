import React from 'react'
import "./Dashboard.css"
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const navigate = useNavigate()
  return (
    <div id="dashboard" className="page-content active">
        <div className="dashboard-hero">
            <h1 className="hero-title">Employee Management Dashboard</h1>
            <p className="hero-subtitle">Welcome to your employee management system. Monitor statistics, manage employees, and generate certificates all in one place.</p>
            
            <div className="quick-actions">
                <button className="btn btnPrimary" style={{
                    border: "2px solid white",
                    padding: "12px 10px 12px 10px",
                    width: "150px",
                    borderRadius: "30px",
                    fontSize: "14px",
                    cursor: "pointer",
                    }} id="quickGenerateBtn" 
                    onClick={()=> navigate("/generate")}>
                    <i className="fas fa-file-pdf"></i> Quick Generate
                </button>
                <button className="btn btnSecondary">
                    <i className="fas fa-chart-line"></i> View Reports
                </button>
                <button className="btn btnSecondary" onClick={()=> navigate("/addEmploye")}>
                    <i className="fas fa-user-plus"></i> Add Employee
                </button>
            </div>
        </div>
    </div>
  )
}

export default Dashboard