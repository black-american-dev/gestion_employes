import React from 'react'
import "./Table.css";
import { Link, useNavigate } from 'react-router-dom';
function Table(props) {
    const employees = props.emp
    const navigate = useNavigate()
    return (
        <div className="wrapper">
            <h2>Employees</h2>
            <div className="table-container">
                <table>
                <thead>
                    <tr>
                    <th>CIN</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>statut</th>
                    </tr>
                </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id} onClick={() => navigate(`/employe/${emp.employee_id}`)}>
                                
                                <td>{emp.cin}</td>
                                <td>{emp.nom}</td>
                                <td>{emp.prenom}</td>
                                <td>
                                <span
                                    className={`status ${
                                    emp.statut === "active" ? "active" : "inactive"
                                    }`}
                                >
                                    {emp.statut ?? "Unknown"}
                                </span>
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table