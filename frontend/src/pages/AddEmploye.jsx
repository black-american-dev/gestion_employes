import React from "react";
import EmployeeForm from "../components/EmployeeForm";
import Button from "../components/ArrowButton";
import "./navbar.css"
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const navigate = useNavigate()
  return (
    <>
      <div style={{display: "flex", gap: "20px", marginTop: "10px",alignItems: "center",}}>
        <Button onClick={()=> navigate(-1)}/><br />
        <h1 className="hero-title">
            Employee <span>Details</span>
        </h1>
      </div>
      <EmployeeForm />
    </>
  );
}

export default AddEmployee;
