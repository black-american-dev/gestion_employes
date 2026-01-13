import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Table from "../components/table";
import Button from "../components/ArrowButton";
import SearchInput from "../components/SearchInput";
import './navbar.css'
import DropDown from "../components/DropDown";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";


function Home() {
  const [employees, setEmployees] = useState([]);
  const [judicialEmployees, setJudicialEmployees] = useState([]);
  const [filter, setFilter] = useState(0);
  const navigate = useNavigate()


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
  const filtredEmploye = filter === 0 ? employees : employees.filter( emp => emp.id_departement === filter)

  return (
    <>
    <header className="header">
      <div className="nav-container">
        <div className="logo">
          HR<span>Docs</span>
          <button class="btn" onClick={()=> navigate("/addEmploye")}>EMPLOYEES</button>
          <button class="btn">GENERATE</button>
          <button class="btn">DOCUMENTS</button>
          <button class="btn">DEPARTMENTS</button>
          <button class="btn">SETTINGS</button>
        </div>
        <SearchInput />
      </div>
    </header>
    <div>
      <Dashboard />
    </div>
    <div className="toolbar">
      <DropDown onChange={setFilter} />
    </div>
    <div>
      <Table emp={filtredEmploye} />
    </div>
    <div className="toolbar">
      <DropDown onChange={setFilter} />
    </div>
    <div>
      <Table emp={judicialEmployees} />
    </div>
    </>
  );
}

export default Home;
