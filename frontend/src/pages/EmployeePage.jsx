import React from 'react'
import { api } from '../api/api';
import { useEffect } from 'react';
import { useState } from 'react';
import NavbarHeader from '../components/NavbarHeader';
import DropDown from '../components/DropDown';
import Table from '../components/table';
import TableJudicial from '../components/TableJudicial';

function EmployeePage() {
      const [employees, setEmployees] = useState([]);
      const [judicialEmployees, setJudicialEmployees] = useState([]);

      const [companyFilter, setCompanyFilter] = useState(0);
      const [judicialFilter, setJudicialFilter] = useState(0);

      const [cityFilter, setCityFilter] = useState("all");
      const [judicialCityFilter, setJudicialCityFilter] = useState("all");

      const [departement, setDepartement] = useState("all");

    
    const options = [
      { label: "All Departments", value: 0 },
      { label: "حفظ الأرشيف", value: 1 },
      { label: "الموارد البشرية", value: 2 },
      { label: "التجهيز و نظم المعلومات", value: 3 },
    ];
    
    const judicialOptions = [
      { label: "All Entities", value: 0 },
      { label: "محكمة الاستئناف", value: "محكمة الاستئناف" },
      { label: "المحكمة الابتدائية", value: "المحكمة الابتدائية" },
      { label: "المركز القضائي", value: "المركز القضائي" },
    ];

    const cityOptions = [
      { label: "All Cities", value: "all" },
      { label: "laayoune", value: "laayoune" },
      { label: "Smara", value: "Smara" },
      { label: "Boujdour", value: "Boujdour" },
      { label: "Dakhla", value: "Dakhla" },
    ];
    const departementOption = [
      { label: "All Departments", value: "all" },
      { label: "النيابة العامة", value: "النيابة العامة" },
      { label: "رئاسة", value: "رئاسة" },
    ]

    // company employee : 
    const filteredCompanyEmployees = employees.filter(emp => {
      const departmentMatch =
        companyFilter === 0 || Number(emp.departement_id) === companyFilter;

      const cityMatch =
        cityFilter === "all" || emp.nom_ville === cityFilter;

      return departmentMatch && cityMatch;
    });

    // judicial employee : 
    const filteredJudicialEmployees = judicialEmployees.filter(emp => {
  const entityMatch =
    judicialFilter === 0 || emp.entity_type === judicialFilter;

  const cityMatch =
    judicialCityFilter === "all" ||
    emp.nom_ville?.toLowerCase() === judicialCityFilter.toLowerCase();

  const departementMatch =
    departement === "all" || emp.department === departement;

  return entityMatch && cityMatch && departementMatch;
});



      useEffect(() => {
        api.get("/companyEmployes")
          .then((res) => setEmployees(res.data))
          .catch((error) => console.error(error));
      }, []);
      useEffect(() => {
        api.get("/judicialEmployees")
          .then((res) => setJudicialEmployees(res.data))
          .catch((error) => console.error(error));
      }, []);
  return (
        <>
    <NavbarHeader />
    
    <div className="toolbar">
      <DropDown options={options} onChange={setCompanyFilter} />
      <DropDown options={cityOptions} onChange={setCityFilter} />
    </div>
    <div>
      <Table emp={filteredCompanyEmployees} />
    </div>
    <div className="toolbar">
      <DropDown options={judicialOptions} onChange={setJudicialFilter} />
      <DropDown options={cityOptions} onChange={setJudicialCityFilter} />
      <DropDown options={departementOption} onChange={setDepartement} />
    </div>

    <div>
      <TableJudicial emp={filteredJudicialEmployees} />
    </div>
    </>
  )
}

export default EmployeePage