"use client";

import React, { useState } from 'react';
import './style.css';

export default function Dropdown({ options, name, onSelect }) {
  const [selected, setSelected] = useState(options[0]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelected(newValue);
    onSelect(newValue); // Call the callback with the new value
  };

  return (
    <section id="dropdown">
      <h2>{name}</h2>
      <select value={selected} onChange={handleChange} className="dropdown-select">
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </section>
  );
}
