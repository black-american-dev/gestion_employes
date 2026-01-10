import React, { useState } from "react";
import "./DropDown.css";

function DropDown({ onChange }) {
    const [selected, setSelected] = useState(0);
    const [open, setOpen] = useState(false);

    const handleChange = (value) => {
        setSelected(value);
        onChange(value);
        setOpen(false);
    };

    return (
        <div className={`select ${open ? "open" : ""}`}>
        <div
            className="selected"
            onClick={() => setOpen(!open)}
        >
            {selected === 0 && "All"}
            {selected === 1 && "التجهيز و نظم المعلومات"}
            {selected === 2 && "الموارد البشرية"}
            {selected === 3 && "حفظ الأرشيف"}

            <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            className="arrow"
            >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
        </div>

        <div className="options">
            <div>
            <input
                id="all"
                name="option"
                type="radio"
                checked={selected ==="All"}
                onChange={() => handleChange(0)}
            />
            <label className="option" htmlFor="all">All</label>
            </div>

            <div>
            <input
                id="option-1"
                name="option"
                type="radio"
                checked={selected ==="التجهيز و نظم المعلومات"}
                onChange={() => handleChange(1)}
            />
            <label className="option" htmlFor="option-1">
                التجهيز و نظم المعلومات
            </label>
            </div>

            <div>
            <input
                id="option-2"
                name="option"
                type="radio"
                checked={selected ==="الموارد البشرية"}
                onChange={() => handleChange(2)}
            />
            <label className="option" htmlFor="option-2">
                الموارد البشرية
            </label>
            </div>

            <div>
            <input
                id="option-3"
                name="option"
                type="radio"
                checked={selected ==="حفظ الأرشيف"}
                onChange={() => handleChange(3)}
            />
            <label className="option" htmlFor="option-3">
                حفظ الأرشيف
            </label>
            </div>
        </div>
        </div>
    );
}

export default DropDown;
