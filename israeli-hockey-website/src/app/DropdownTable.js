// DropdownClient.js
"use client";

import React, { useState } from "react";
import Dropdown from "./Dropdown";

export default function DropdownTable({ dropdownOptions }) {
  const [selectedOption, setSelectedOption] = useState(dropdownOptions[0]);

  const handleDropdownSelect = (value) => {
    setSelectedOption(value);
    console.log("Selected option:", value); // Handle the selected value here
  };

  return (
    <>
      <Dropdown
        options={dropdownOptions}
        name={"Select Option"}
        onSelect={handleDropdownSelect}
      />
      <p>Selected Option: {selectedOption}</p>{" "}
      {/* Display the selected option for demonstration */}
    </>
  );
}
