import React, { useEffect, useState } from 'react'
import { api } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import Table from '../components/table';
import "./navbar.css"
import Button from '../components/ArrowButton.jsx';
import SearchInput from '../components/SearchInput.jsx';

function Employe() {
    const [employee, setEmployee] = useState([]);
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        api.get(`/employe/${id}`)
        .then((res) => setEmployee(res.data))
        .catch((error) => console.error(error));
    }, []);

    return (
        <>
        <main className="container">
            <section className="hero">
                <div>
                    <div style={{display: "flex", gap: "20px", marginTop: "10px",alignItems: "center",}}>
                        <Button onClick={()=> navigate(-1)}/><br />
                        <h1 className="hero-title">
                            Employee <span>Details</span>
                        </h1>
                    </div>
                    
                    <div className="glass-card">
                        <div className="info-row">
                            <span>Name</span><strong>{employee.nom}</strong>
                        </div>
                        <div className="info-row">
                            <span>CIN</span><strong>{employee.cin}</strong>
                        </div>

                        <button className="btn btn-primary">
                            Generate Work Certificate
                        </button>
                        <button className="btn btn-secondary">
                            Generate Administrative Certificate
                        </button>
                    </div>
                </div>

                <div className="glass-card">
                    <h3>Generated Documents</h3>
                    {/* history list */}
                </div>
            </section>
        </main>
        </>
    );
}

export default Employe