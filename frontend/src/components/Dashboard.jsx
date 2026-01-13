import React from 'react'
import "./Dashboard.css"
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const navigate = useNavigate()
  return (
    <div id="dashboard" class="page-content active">
        <div class="dashboard-hero">
            <h1 class="hero-title">Employee Management Dashboard</h1>
            <p class="hero-subtitle">Welcome to your employee management system. Monitor statistics, manage employees, and generate certificates all in one place.</p>
            
            <div class="quick-actions">
                <button class="btn btn-primary" style={{
                    border: "2px solid white",
                    padding: "12px 10px 12px 10px",
                    width: "150px",
                    borderRadius: "30px",
                    fontSize: "14px",
                    cursor: "pointer",
                    }} id="quickGenerateBtn">
                    <i class="fas fa-file-pdf"></i> Quick Generate
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-chart-line"></i> View Reports
                </button>
                <button class="btn btn-secondary" onClick={()=> navigate("/addEmploye")}>
                    <i class="fas fa-user-plus"></i> Add Employee
                </button>
            </div>
        </div>
    </div>
  )
}

export default Dashboard