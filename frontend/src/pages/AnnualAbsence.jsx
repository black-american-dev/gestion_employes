import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import "./navbar.css";
import TableAnuual from "../components/TableAnnual";
import styles from "./AnnualAbsence.module.css";
import AnuallForm from "../components/AnuallForm";
import NavbarHeader from "../components/NavbarHeader";

function AnnualAbsence() {
  const [judicialEmployees, setJudicialEmployees] = useState([]);
  const [judicialFilter, setJudicialFilter] = useState(null);

  const [addAnuall, setAddAnuall] = useState(false);
  const [showAnuall, setShowAnuall] = useState(false);

  const [years, setYears] = useState([]);

  // Fetch available years from backend
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await api.get("/annual-absence/years");
        setYears(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("fetchYears error:", err);
        setYears([]);
      }
    };

    fetchYears();
  }, []);

  // Fetch annual absences data
  const fetchAnnualAbsences = async () => {
    try {
      const res = await api.get("/annual-absence");
      setJudicialEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchAnnualAbsences error:", err);
      setJudicialEmployees([]);
    }
  };

  useEffect(() => {
    fetchAnnualAbsences();
  }, []);

  // Auto-select newest year when showing table
  useEffect(() => {
    if (showAnuall && years.length > 0 && judicialFilter === null) {
      // assumes backend returns years sorted DESC: [2026, 2025, 2024]
      setJudicialFilter(years[0]);
    }
  }, [showAnuall, years, judicialFilter]);

  // Robust filter (handles year as string or number)
  const filteredJudicialEmployees =
    judicialFilter === null
      ? []
      : judicialEmployees.filter(
          (emp) => Number(emp.year) === Number(judicialFilter)
        );

  const downloadExcel = async () => {
    if (judicialFilter === null) return;

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

      <div className="form-wrapper">
        <div className="form-card" style={{ marginRight: "5px" }}>
          <h1>Add new anuall absence year</h1>
          <div className="form-actions">
            <button
              className="btn-primary"
              type="button"
              onClick={() => {
                setAddAnuall(true);
                setShowAnuall(false);
                setJudicialFilter(null);
              }}
            >
              Add new
            </button>
          </div>
        </div>

        <div className="form-card" style={{ marginLeft: "5px" }}>
          <h1>Show anuall absences</h1>
          <div className="form-actions">
            <button
              className="btn-primary"
              type="button"
              onClick={() => {
                setAddAnuall(false);
                setShowAnuall(true);
                // judicialFilter auto-selected by effect
              }}
            >
              Show all
            </button>
          </div>
        </div>
      </div>

      {addAnuall && <AnuallForm />}

      {showAnuall && years.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No years available yet. Import or add annual absences first.
        </p>
      )}

      {showAnuall && years.length > 0 && (
        <>
          <div>
            {years.map((year) => (
              <h1
                key={year}
                onClick={() =>
                  setJudicialFilter(
                    Number(judicialFilter) === Number(year) ? null : year
                  )
                }
                className={`${styles.searchBox} ${
                  Number(judicialFilter) === Number(year) ? styles.activeYear : ""
                }`}
              >
                {year}
              </h1>
            ))}
          </div>

          <div>
            {judicialFilter === null ? (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                Please select a year to display annual absences
              </p>
            ) : (
              <div>
                <TableAnuual emp={filteredJudicialEmployees} refresh={fetchAnnualAbsences} />

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
