import React, { useState } from "react";
import "./EmployeeForm.css";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function AnuallForm() {
  const [form, setForm] = useState({
    year: "",
    file: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("year", form.year);
      formData.append("file", form.file);

      const res = await api.post(
        "/annual-absence/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
        <h2>Add New Company Employee</h2>
        <p className="subtitle">Fill employee information</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Year</label>
              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="year"
              />
            </div>

            <div className="form-group">
              <label>File</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                accept=".xlsx,.xls"
              />
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

export default AnuallForm;
