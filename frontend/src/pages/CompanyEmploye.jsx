import React, { useEffect, useState } from "react";
import { api } from "../api/api.js";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Employe.module.css";
import './navbar.css'
import NavbarHeader from "../components/NavbarHeader.jsx";
import Modal from "../components/Modal";
import AttestationCongeForm from "../components/AttestationCongeForm";

import DeleteButton from "../components/DeleteButton.jsx";



function CompanyEmploye() {
  const [employee, setEmployee] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [historyUploads, setHistoryUploads] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate()

  useEffect(() => {
    api
      .get(`/companyEmploye/${id}`)
      .then((res) =>{ 
        setEmployee(res.data.employee)
        setHistoryUploads(res.data.certificates)})
      .catch(console.error);
      console.log(historyUploads);
      
  }, [id]);
 const handleDelete = async () => {
    try {
      await api.delete(`/companyEmploye/${id}`).then(res => console.log(res.data)
      )
      alert("Employee deleted successfully");
      navigate("/")
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };
  
  const handleGenerateTravaille = async (id) => {
  const res = await api.post(
    `/generate/${id}`,
    {type: "attestation de travaille"},
    { responseType: "blob" } // 🔥 IMPORTANT
  );

  // Create download
  const url = window.URL.createObjectURL(
    new Blob([res.data], { type: "application/pdf" })
  );

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${id}_attestation.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};


  return (
    <>
      {/* HEADER */}
      <NavbarHeader />

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

              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleGenerateTravaille(employee.employee_id)}>
                attestation de travaille (PDF)
              </button>
              <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setOpenForm(true)}
                >
                  Gestion des licences administratives (PDF)
              </button>

            </div>
          </div>
          

          {/* RIGHT */}
          <div className={styles.card}>
            <h3 style={{ marginBottom: "15px" }}>Generated Documents</h3>
            {historyUploads.length === 0 ? (
              <span>No file found</span>
              ) : (
                historyUploads.map((p)=> (
                <div className={styles.historyItem}>
                  <span>{p.certificate_type}</span>
                  <span>{p.uploaded_at.split("T")[0]}</span>
                </div>
              ))
              )}
          </div>
          <div className={styles.card}>
            <h1 className={styles.heroTitle}>
              Delete <span>This employee !</span>
            </h1>
              <div onClick={handleDelete}>
                <DeleteButton />
              </div>
          </div>
        </section>
      </main>
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <AttestationCongeForm
          employeeId={employee.employee_id}
          onClose={() => setOpenForm(false)}
        />
      </Modal>


    </>
  );
}

export default CompanyEmploye;
