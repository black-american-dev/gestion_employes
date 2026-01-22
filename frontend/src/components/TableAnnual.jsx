import React, { useState } from "react";
import "./Table.css";
import { api } from "../api/api";

function EditableCell({ value, rowId, field, refresh }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  const save = async () => {
    setEditing(false);

    if (val !== value) {
      try {
        await api.put(`/annual-absence/${rowId}`, {
          field,
          value: val,
        });
        refresh();
      } catch (err) {
        alert("Update failed");
      }
    }
  };

  return editing ? (
    <input
      autoFocus
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => e.key === "Enter" && save()}
      style={{ width: "100%" }}
    />
  ) : (
    <span
      onDoubleClick={() => setEditing(true)}
      style={{ cursor: "pointer" }}
      title="Double click to edit"
    >
      {value || "—"}
    </span>
  );
}

function TableAnuual({ emp, refresh }) {
  return (
    <div className="glass-card">
      <h3 className="card-title">Annual Absences</h3>

      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Year</th>
            <th>CIN</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Full Name</th>
            <th>Cadre Actuel</th>
            <th>Département</th>
            <th>Situation</th>
          </tr>
        </thead>

        <tbody>
          {emp.map((e) => (
            <tr key={e.id}>
              <td>{e.employee_id}</td>
              <td>{e.year}</td>

              <td><EditableCell value={e.cin} rowId={e.id} field="cin" refresh={refresh} /></td>
              <td><EditableCell value={e.nom} rowId={e.id} field="nom" refresh={refresh} /></td>
              <td><EditableCell value={e.prenom} rowId={e.id} field="prenom" refresh={refresh} /></td>
              <td><EditableCell value={e.fullName} rowId={e.id} field="fullName" refresh={refresh} /></td>
              <td><EditableCell value={e.cadre_actuel} rowId={e.id} field="cadre_actuel" refresh={refresh} /></td>
              <td><EditableCell value={e.departement} rowId={e.id} field="departement" refresh={refresh} /></td>
              <td><EditableCell value={e.situation} rowId={e.id} field="situation" refresh={refresh} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <span className="count">{emp.length} total</span>
    </div>
  );
}

export default TableAnuual;
