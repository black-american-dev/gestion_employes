import React, { useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import Button from "../components/ArrowButton";
import "./navbar.css"
import { useNavigate } from "react-router-dom";
import JudicialEmployeeForm from "../components/JudicialEmployeeForm";

function AddEmployee() {
  const [companyEmp, setCompanyEmp] = useState(false)
  const [judicialEmp, setJudicialEmp] = useState(false)
  const navigate = useNavigate()
  return (
    <>
      <div style={{display: "flex", gap: "20px", marginTop: "10px",alignItems: "center",}}>
        <Button onClick={()=> navigate(-1)}/><br />
        <h1 className="logo">
          <p onClick={()=> navigate("/")}>Employee<span>Details</span></p>
        </h1>
      </div>
      <div className="form-wrapper">
      <div className="form-card" style={{marginRight: "5px"}}>
        <h1>Company employee</h1>
        <div className="form-actions">
            <button className="btn-primary" type="submit" onClick={() => {
              setCompanyEmp(true)
              setJudicialEmp(false)
              }}>
              Add Employee
            </button>
          </div>
      </div>
      <div className="form-card" style={{marginLeft: "5px"}}>
        <h1>Judicial employee</h1>
        <div className="form-actions">
            <button className="btn-primary" type="submit" onClick={() => {
              setCompanyEmp(false)
              setJudicialEmp(true)
              }}>
              Add Employee
            </button>
          </div>
      </div>
      </div>
      {companyEmp && <EmployeeForm />}
      {judicialEmp && <JudicialEmployeeForm />}
      
    </>
  );
}

export default AddEmployee;
