import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import SearchInput from "../components/SearchInput";
import "./navbar.css";
import TableAnuual from "../components/TableAnnual";
import styles from "./AnnualAbsence.module.css";
import EmployeeForm from "../components/EmployeeForm";
import AnuallForm from "../components/AnuallForm";
import NavbarHeader from "../components/NavbarHeader";

function AnnualAbsence() {
  const [judicialEmployees, setJudicialEmployees] = useState([]);
  const [judicialFilter, setJudicialFilter] = useState(null);

  const [addAnuall, setAddAnuall] = useState(false)
    const [showAnuall, setShowAnuall] = useState(false)

  const years = [2026, 2025, 2024]; // ✅ define years

    const fetchAnnualAbsences = async () => {
    try {
      const res = await api.get("/annual-absence");
      setJudicialEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnualAbsences();
  }, []);

  const filteredJudicialEmployees =
    judicialFilter === null
      ? []
      : judicialEmployees.filter(
          (emp) => emp.year === judicialFilter
        );

    const downloadExcel = async () => {
      try {
        const res = await api.get(
          `/annual-absence/export?year=${judicialFilter}`,
          { responseType: "blob" }
        );

        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `annual_absences_${judicialFilter}.xlsx`;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed", error);
      }
    };


  return (
    <>
      <NavbarHeader />

      {/* Year selector */}
      <div className="form-wrapper">
      <div className="form-card" style={{marginRight: "5px"}}>
        <h1>Add new anuall absence year </h1>
        <div className="form-actions">
            <button className="btn-primary" type="submit" onClick={() => {
              setAddAnuall(true)
              setShowAnuall(false)
              }}>
              Add new
            </button>
          </div>
      </div>
      <div className="form-card" style={{marginLeft: "5px"}}>
        <h1>Show anuall absences</h1>
        <div className="form-actions">
            <button className="btn-primary" type="submit" onClick={() => {
              setAddAnuall(false)
              setShowAnuall(true)
              }}>
              Show all
            </button>
          </div>
      </div>
      </div>

        {addAnuall && <AnuallForm />}

      {showAnuall && judicialFilter === null && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Please select a year to display annual absences
        </p>
      )}

      {/* Table */}
      {showAnuall && (
        <>
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
          <div>
            {judicialFilter !== null && (
            <div>
              <TableAnuual
                emp={filteredJudicialEmployees}
                refresh={fetchAnnualAbsences}
              />
              <div
                style={{
                  maxWidth: "1200px",
                  margin: "16px auto 24px auto",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn btnSecondary"
                  disabled={judicialFilter === null}
                  onClick={downloadExcel}
                >
                  Download Excel
                </button>
              </div>
            </div>
          )}
            
          </div>
        </>
      )}
    </>
  );
}

export default AnnualAbsence;
