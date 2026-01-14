import React from 'react'
import "./Table.css";
import { Link, useNavigate } from 'react-router-dom';
function Table(props) {
    const employees = props.emp
    const navigate = useNavigate()
    return (
<div className="glass-card">
  <h3 className="card-title">Employees</h3>
    <table>
      <thead>
        <tr>
          <th>employee id</th>
          <th>CIN</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Cadre actuel</th>
          <th>Ville</th>
          <th>Departement name</th>
          <th>Departement</th>
          <th>Status</th>
          <th>Date embache</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id} onClick={() => navigate(`/employe/${emp.employee_id}`)}>
            <td>{emp.employee_id}</td>
            <td>{emp.cin}</td>
            <td>{emp.nom}</td>
            <td>{emp.prenom}</td>
            <td>{emp.cadre_actuel}</td>
            <td>{emp.nom_ville}</td>
            <td>{emp.entity_type}</td>
            <td>{emp.department}</td>
            <td>
              <span className={`badge ${emp.status === "active" ? "active" : "non active"}`}>
                {emp.status ?? "Unknown"}
              </span>
            </td>
            <td>{emp.hire_date.split("T")[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  <span className="count">{employees.length} total</span>
</div>

    )
}

export default Table