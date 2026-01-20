import React, { useEffect, useState } from "react";
import "./SearchInput.css";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function SearchInput() {
  const [value, setValue] = useState("");
  const [results, setResults] = useState({
    company: [],
    judicial: [],
  });
  const navigate = useNavigate()

  useEffect(() => {
    if (!value.trim()) {
      setResults({ company: [], judicial: [] });
      return;
    }

    const delay = setTimeout(() => {
      api
        .post("/search", { query: value })
        .then((res) => setResults(res.data))
        .catch(() =>
          setResults({ company: [], judicial: [] })
        );
    }, 400);

    return () => clearTimeout(delay);
  }, [value]);

  return (
    <div className="search-container">
      <i className="fas fa-search search-icon"></i>

      <input
        className="search-box"
        placeholder="Employee ID or name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {value && (
        <div className="search-results-panel">
          {/* COMPANY */}
          <div className="search-section">
            <div className="search-section-title">
              🏢 Company
            </div>

            {results.company.length > 0 ? (
              results.company.map((e) => (
                <div
                  key={`c-${e.employee_id}`}
                  className="search-item"
                  onClick={() => navigate(`/companyEmploye/${e.employee_id}`)}
                >
                  <strong>{e.employee_id}</strong> —{" "}
                  {e.nom} {e.prenom}
                </div>
              ))
            ) : (
              <div className="search-empty">
                No match
              </div>
            )}
          </div>

          {/* JUDICIAL */}
          <div className="search-section">
            <div className="search-section-title">
              ⚖ Judicial
            </div>

            {results.judicial.length > 0 ? (
              results.judicial.map((e) => (
                <div
                  key={`j-${e.employee_id}`}
                  className="search-item"
                  onClick={() => navigate(`/judicialEmploye/${e.employee_id}`)}
                >
                  <strong>{e.employee_id}</strong> —{" "}
                  {e.nom} {e.prenom}
                </div>
              ))
            ) : (
              <div className="search-empty">
                No match
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchInput;
