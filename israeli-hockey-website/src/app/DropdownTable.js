// DropdownClient.js
"use client";

import React, { useState } from "react";
import Dropdown from "./Dropdown";

export default function DropdownTable({ options, name }) {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleDropdownSelect = (value) => {
    setSelectedOption(value);
  };

  return (
    <>
      <Dropdown
        options={options}
        name={name}
        onSelect={handleDropdownSelect}
      />
    </>
  );
}
