import React from 'react'
import "./Table.css";
import { Link } from 'react-router-dom';
function TableOfDocuments(props) {
    const employees = props.emp

    return (
<div className="glass-card">
    <h3 className="card-title">Employees Documents</h3>
    {employees.map(emp => (
        <div className="glass-card" onClick={()=> {}}>
            <>
                <h2>{emp.certificate_type}</h2>
                <div className="logo">
                    <h4>file name :<span>{emp.file_name}</span></h4>
                </div>
                <div className="logo">
                    <h4>at :<span>{emp.uploaded_at.split("T")[0]}</span></h4>
                </div>
                <div className="logo">
                    <h4>employee id :<span>{emp.employee_id}</span></h4>
                </div>
            </>
        </div>
    ))}
    <span className="count">{employees.length} total</span>
 </div>
    )
}

export default TableOfDocuments