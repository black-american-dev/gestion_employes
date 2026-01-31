import React, { useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import Button from "../components/ArrowButton";
import "./navbar.css"
import JudicialEmployeeForm from "../components/JudicialEmployeeForm";
import NavbarHeader from "../components/NavbarHeader";

function AddEmployee() {
  const [companyEmp, setCompanyEmp] = useState(false)
  const [judicialEmp, setJudicialEmp] = useState(false)
  return (
    <>
      <NavbarHeader />
      <div className="form-wrapper">
      <div className="form-card" style={{marginRight: "5px"}}>
        <h1>Direction employee</h1>
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
