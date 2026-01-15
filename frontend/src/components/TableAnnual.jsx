import React from 'react'
import "./Table.css";
import { Link, useNavigate } from 'react-router-dom';
function TableAnuual(props) {
    const employees = props.emp
    const navigate = useNavigate()

    return (
<div className="glass-card">
  <h3 className="card-title">Employees</h3>
    <table>
      <thead>
        <tr>
          <th>employee id</th>
          <th>year</th>
          <th>cin</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Cadre actuel</th>
          <th>Departement</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id} onClick={() => navigate(`/judicialEmploye/${emp.employee_id}`)}>
            <td>{emp.employee_id}</td>
            <td>{emp.year}</td>
            <td>{emp.cin}</td>
            <td>{emp.nom}</td>
            <td>{emp.prenom}</td>
            <td>{emp.cadre_actuel}</td>
            <td>{emp.departement}</td>
          </tr>
        ))}
      </tbody>
    </table>
  <span className="count">{employees.length} total</span>
</div>

    )
}

export default TableAnuual