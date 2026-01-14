import { useState } from "react";
import "./DropDown.css";

function DropDown({ options ,onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All Departments");



  const handleSelect = (option) => {
    setSelected(option.label);
    onChange(option.value);
    setOpen(false); // ✅ CLOSE after click
    console.log(option.value);
    
  };

  return (
    <div className={`select ${open ? "open" : ""}`}>
      <div
        className="selected"
        onClick={() => setOpen((prev) => !prev)} // ✅ TOGGLE
      >
        {selected}
        <svg className="arrow" width="12" height="12" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {open && ( // ✅ ONLY render when open
        <div className="options">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="option"
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropDown;
