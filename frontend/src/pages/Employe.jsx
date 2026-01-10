import React, { useEffect, useState } from 'react'
import { api } from '../api/api';
import { useParams } from 'react-router-dom';
import Table from '../components/table';
import ArrowButton from '../components/ArrowButton.jsx'

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
            <ArrowButton />
            <Table emp={employee} />
        </>
    );
}

export default Employe