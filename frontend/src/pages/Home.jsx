import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Table from "../components/table";
import TableJudicial from "../components/TableJudicial";
import SearchInput from "../components/SearchInput";
import './navbar.css'
import DropDown from "../components/DropDown";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";


function Home() {
  const [employees, setEmployees] = useState([]);
  const [judicialEmployees, setJudicialEmployees] = useState([]);
  const [companyFilter, setCompanyFilter] = useState(0);
  const [judicialFilter, setJudicialFilter] = useState(0);
  const navigate = useNavigate()

    const options = [
    { label: "All Departments", value: 0 },
    { label: "حفظ الأرشيف", value: 1 },
    { label: "الموارد البشرية", value: 2 },
    { label: "التجهيز و نظم المعلومات", value: 3 },
  ];

  const judicialOptions = [
  { label: "All Entities", value: 0 },
  { label: "محكمة الاستئناف", value: "محكمة الاستئناف" },
  { label: "المحكمة الابتدائية", value: "المحكمة الابتدائية" },
  { label: "المركز القضائي", value: "المركز القضائي" },
];


  useEffect(() => {
    api.get("/companyEmployes")
      .then((res) => setEmployees(res.data))
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    api.get("/judicialEmployees")
      .then((res) => setJudicialEmployees(res.data))
      .catch((error) => console.error(error));
  }, []);
  
  const filteredCompanyEmployees =
    companyFilter === 0
      ? employees
      : employees.filter(
          emp => Number(emp.departement_id) === companyFilter
        );

  const filteredJudicialEmployees =
    judicialFilter === 0
      ? judicialEmployees
      : judicialEmployees.filter(
          emp => emp.entity_type === judicialFilter
        );

  return (
    <>
    <header className="header">
      <div className="nav-container">
        <div className="logo">
          <p onClick={()=> navigate("/")}>HR<span>Docs</span></p>
          <button className="btn" onClick={()=> navigate("/addEmploye")}>EMPLOYEES</button>
          <button className="btn">GENERATE</button>
          <button className="btn">DOCUMENTS</button>
          <button className="btn" onClick={() => navigate("/anualAbsence")}>ANNUAL ABCENCE</button>
          <button className="btn">SETTINGS</button>
        </div>
        <SearchInput />
      </div>
    </header>
    <div>
      <Dashboard />
    </div>
    <div className="toolbar">
      <DropDown options={options} onChange={setCompanyFilter} />
    </div>
    <div>
      <Table emp={filteredCompanyEmployees} />
    </div>
    <div className="toolbar">
      <DropDown options={judicialOptions} onChange={setJudicialFilter} />
    </div>
    <div>
      <TableJudicial emp={filteredJudicialEmployees} />
    </div>
    </>
  );
}

export default Home;
