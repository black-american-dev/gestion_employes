import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import SearchInput from "../components/SearchInput";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import TableAnuual from "../components/TableAnnual";
import styles from "./AnnualAbsence.module.css";

function AnnualAbsence() {
  const [judicialEmployees, setJudicialEmployees] = useState([]);
  const [judicialFilter, setJudicialFilter] = useState(null);
  const navigate = useNavigate();

  const years = [2026, 2025, 2024]; // ✅ define years

  useEffect(() => {
    api.get("/annual-absence")
      .then((res) => setJudicialEmployees(res.data))
      .catch((error) => console.error(error));
  }, []);

  const filteredJudicialEmployees =
    judicialFilter === null
      ? []
      : judicialEmployees.filter(
          (emp) => emp.year === judicialFilter
        );

  return (
    <>
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <p onClick={() => navigate("/")}>
              HR<span>Docs</span>
            </p>
            <button className="btn" onClick={() => navigate("/addEmploye")}>
              EMPLOYEES
            </button>
            <button className="btn">GENERATE</button>
            <button className="btn">DOCUMENTS</button>
            <button className="btn" onClick={() => navigate("/anualAbsence")}>
              ANNUAL ABSENCE
            </button>
            <button className="btn">SETTINGS</button>
          </div>
          <SearchInput />
        </div>
      </header>

      {/* Year selector */}
      <div>
        {years.map((year) => (
          <h1
            key={year}
            onClick={() =>
              setJudicialFilter(judicialFilter === year ? null : year)
            }
            className={`${styles.searchBox} ${
              judicialFilter === year ? styles.activeYear : ""
            }`}
          >
            {year}
          </h1>
        ))}
      </div>

      {/* Hint */}
      {judicialFilter === null && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Please select a year to display annual absences
        </p>
      )}

      {/* Table */}
      {judicialFilter !== null && (
        <div>
          <TableAnuual emp={filteredJudicialEmployees} />
        </div>
      )}
    </>
  );
}

export default AnnualAbsence;
