import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Table from "../components/table";
import Button from "../components/ArrowButton";
import SearchInput from "../components/SearchInput";
import './navbar.css'
import DropDown from "../components/DropDown";

function Home() {
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState(0);

  useEffect(() => {
    api.get("/employes")
      .then((res) => setEmployees(res.data))
      .catch((error) => console.error(error));
  }, []);
  const filtredEmploye = filter === 0 ? employees : employees.filter( emp => emp.id_departement === filter)

  return (
    <>
      <div className="navbar">
        <div>
          <h1>my app</h1>
        </div>
        <SearchInput />
      </div>
      <div className="navbar">
        <Button/>
        <DropDown onChange={setFilter}/>
      </div>
      
      <Table emp={filtredEmploye} />
    </>
  );
}

export default Home;
