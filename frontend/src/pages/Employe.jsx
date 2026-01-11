import React, { useEffect, useState } from 'react'
import { api } from '../api/api';
import { useParams } from 'react-router-dom';
import Table from '../components/table';
import "./navbar.css"
import Button from '../components/ArrowButton.jsx';
import SearchInput from '../components/SearchInput.jsx';

function Employe() {
    const [employee, setEmployee] = useState([]);
    const {id} = useParams()

    useEffect(() => {
        api.get(`/employe/${id}`)
        .then((res) => setEmployee(res.data))
        .catch((error) => console.error(error));
    }, []);

    return (
        <>
        <div className="navbar">
            <h1 className="logo">Employee Manager</h1>
            <SearchInput />
        </div>

        <div className="toolbar">
            <Button />
        </div>
        <div>
            <Table emp={employee} />
        </div>
        </>
    );
}

export default Employe