import React, { useState } from "react";
import "./EmployeeForm.css"; // reuse SAME styles
import { api } from "../api/api";

function AttestationCongeForm({ employeeId, onClose }) {
  const [form, setForm] = useState({
    type: "Gestion des licences administratives",
    duty: "",
    subtitueEmployee: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        `/generateConge/${employeeId}`,
        form,
        { responseType: "blob" }
      );

      // Download PDF
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${employeeId}_attestation_conge.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      onClose(); // close modal after success
    } catch (error) {
      console.error(error);
      alert("PDF generation failed");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Attestation de Congé</h2>
        <p className="subtitle">Renseignez les informations de la licence</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Duty */}
            <div className="form-group">
              <label>المهام المكلف بها</label>
              <input
                name="duty"
                value={form.duty}
                onChange={handleChange}
                placeholder="مثال: المهام الإدارية"
                required
              />
            </div>

            {/* Substitute */}
            <div className="form-group">
              <label>الموظف المعوض</label>
              <input
                name="subtitueEmployee"
                value={form.subtitueEmployee}
                onChange={handleChange}
                placeholder="أحمد بن يوسف"
                required
              />
            </div>

            {/* Start date */}
            <div className="form-group">
              <label>تاريخ بداية الرخصة</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* End date */}
            <div className="form-group">
              <label>تاريخ نهاية الرخصة</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit">
              Générer le PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttestationCongeForm;
