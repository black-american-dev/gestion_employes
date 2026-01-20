import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Table from "../components/table";
import TableJudicial from "../components/TableJudicial";
import SearchInput from "../components/SearchInput";
import './navbar.css'
import DropDown from "../components/DropDown";
import Dashboard from "../components/Dashboard";
import NavbarHeader from "../components/NavbarHeader";


function Home() {
  const [employees, setEmployees] = useState([]);
  const [judicialEmployees, setJudicialEmployees] = useState([]);
  const [companyFilter, setCompanyFilter] = useState(0);
  const [judicialFilter, setJudicialFilter] = useState(0);

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
    <NavbarHeader />
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
