import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Table from "../components/table";
import Button from "../components/ArrowButton";
import SearchInput from "../components/SearchInput";
import './navbar.css'
import DropDown from "../components/DropDown";
import { useNavigate } from "react-router-dom";

function Home() {
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/employes")
      .then((res) => setEmployees(res.data))
      .catch((error) => console.error(error));
  }, []);
  const filtredEmploye = filter === 0 ? employees : employees.filter( emp => emp.id_departement === filter)

  return (
    <>
      <div className="navbar">
        <h1 className="logo">Employee Manager</h1>
        <SearchInput />
        <button onClick={()=> navigate("/addEmploye")} className="addButton">Add employe</button>
      </div>

      <div className="toolbar">
        <Button />
        <DropDown onChange={setFilter} />
      </div>
      <div>
        <Table emp={filtredEmploye} />
      </div>

    </>
  );
}

export default Home;
