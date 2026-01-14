import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Employe.module.css";
import SearchInput from "../components/SearchInput.jsx";
import './navbar.css'

function Employe() {
  const [employee, setEmployee] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/companyEmploye/${id}`)
      .then((res) => setEmployee(res.data[0]))
      .catch(console.error);
    
  }, [id]);
  return (
    <>
      {/* HEADER */}
      <header className="header">
      <div className="nav-container">
        <div className="logo">
          HR<span>Docs</span>
          <button className="btn" onClick={()=> navigate("/addEmploye")}>EMPLOYEES</button>
          <button className="btn">GENERATE</button>
          <button className="btn">DOCUMENTS</button>
          <button className="btn">DEPARTMENTS</button>
          <button className="btn">SETTINGS</button>
        </div>
        <SearchInput />
      </div>
    </header>

      {/* MAIN */}
      <main>
        <section className={styles.hero}>
          {/* LEFT */}
          <div>
            <h1 className={styles.heroTitle}>
              Employee <span>Certificate Generator</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Type an employee number to instantly generate official company PDF documents.
            </p>

            <div className={styles.card}>
              <h3 style={{ marginBottom: "15px" }}>Employee Information</h3>

              <div className={styles.infoRow}><span>Name</span><strong>{employee.nom}</strong></div>
              <div className={styles.infoRow}><span>Employee ID</span><strong>{employee.employee_id}</strong></div>
              <div className={styles.infoRow}><span>CIN</span><strong>{employee.cin}</strong></div>
              <div className={styles.infoRow}><span>Department</span><strong>{employee.departement_nom}</strong></div>
              <div className={styles.infoRow}><span>City</span><strong>{employee.nom_ville}</strong></div>

              <button className={`${styles.btn} ${styles.btnPrimary}`}>
                Generate Work Certificate (PDF)
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                Generate Administrative Certificate
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.card}>
            <h3 style={{ marginBottom: "15px" }}>Generated Documents</h3>

            <div className={styles.historyItem}>
              <span>Work Certificate</span>
              <span>10 Jan 2025</span>
            </div>

            <div className={styles.historyItem}>
              <span>Administrative Certificate</span>
              <span>03 Nov 2024</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Employe;
