import React from 'react'
import NavbarHeader from '../components/NavbarHeader'
import TableOfDocuments from '../components/TableOfDocuments'
import { useEffect } from 'react'
import { api } from '../api/api'
import { useState } from 'react'

function Documents() {
    const [documents,setDocuments] = useState([])
    useEffect(()=>{
        api.get("/Documents")
        .then(res => setDocuments(res.data))
    })
    return (
    <>
        <NavbarHeader />

        <div className="toolbar">
            <TableOfDocuments emp={documents} />
        </div>
    </>
    )
}

export default Documents