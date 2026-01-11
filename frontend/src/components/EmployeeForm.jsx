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
    ville: "العيون",
    date_embauche: "",
    departement: "",
    statut: "active",
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
        api.post("/employe",form)
        .then(res =>console.log(res.data))
        navigate("/")
    }catch(error){
        error.log(error)
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Add New Employee</h2>
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
              <label>Ville</label>
              <input
                name="ville"
                value={form.ville}
                onChange={handleChange}
                placeholder="Ville"
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
              <label>Département</label>
              <select
                name="departement"
                value={form.departement}
                onChange={handleChange}
              >
                <option value="">Select department</option>
                <option value="1">التجهيز و نظم المعلومات</option>
                <option value="2">الموارد البشرية</option>
                <option value="3">حفظ الأرشيف</option>
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
                <option value="inactive">Inactive</option>
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
