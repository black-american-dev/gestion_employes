import React, { useState } from "react";
import "./EmployeeForm.css";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function EmployeeForm() {
const [form, setForm] = useState({
    employe_id: "",
    cin: "",
    nom: "",
    prenom: "",
    cadre_actuel: "",
    judicial_entity_id: "",
    department: "",
    date_embauche: "",
    statut: "active",
});

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await api.post("/judicialEmploye", form);
      console.log(res.data);
      navigate("/");
    } catch (error) {
      console.error("Backend error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Insert failed");
    }
  };
  

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Add New Judicial Employee</h2>
        <p className="subtitle">Fill employee information</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
             <div className="form-group">
              <label>Employee id</label>
              <input
                name="employe_id"
                value={form.employe_id}
                onChange={handleChange}
                placeholder="Employee ID"
              />
            </div>

            <div className="form-group">
              <label>CIN</label>
              <input
                name="cin"
                value={form.cin}
                onChange={handleChange}
                placeholder="Employee CIN"
              />
            </div>

            <div className="form-group">
              <label>Nom</label>
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>

            <div className="form-group">
              <label>Prénom</label>
              <input
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                placeholder="First name"
              />
            </div>

            <div className="form-group">
              <label>cadre actuel</label>
              <input
                name="cadre_actuel"
                value={form.cadre_actuel}
                onChange={handleChange}
                placeholder="cadre actuel"
              />
            </div>

            <div className="form-group">
                <label>Date de Embauche</label>
                <input placeholder="Search" 
                    type="date"
                    name="date_embauche"
                    value={form.date_embauche}
                    onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>judicial entity</label>
              <select
                name="judicial_entity_id"
                value={form.judicial_entity_id}
                onChange={handleChange}
              >
                <option value="">Select department</option>
                <option value="1">محكمة الاستئناف Laayoune</option>
                <option value="2">المحكمة الابتدائي Laayoune</option>
                <option value="3">المحكمة الابتدائي Smara</option>
                <option value="4">المحكمة الابتدائي Dakhla</option>
                <option value="5">المحكمة الابتدائي Boujdour</option>
                <option value="6">المركز القضائي Tarfaya</option>
              </select>
            </div>

            <div className="form-group">
              <label>Département</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
              >
                <option value="">Select department</option>
                <option value="1">النيابة العامة</option>
                <option value="2">رئاسة</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="non active">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit">
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
