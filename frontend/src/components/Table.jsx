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
          <th>Ville</th>
          <th>Date embache</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id} onClick={() => navigate(`/employe/${emp.employee_id}`)}>
            <td>{emp.employee_id}</td>
            <td>{emp.cin}</td>
            <td>{emp.nom}</td>
            <td>{emp.prenom}</td>
            <td>{emp.nom_ville}</td>
            <td>{emp.date_embauche}</td>
            <td>
              <span className={`badge ${emp.statut === "active" ? "active" : "inactive"}`}>
                {emp.statut ?? "Unknown"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  <span className="count">{employees.length} total</span>
</div>

    )
}

export default Table