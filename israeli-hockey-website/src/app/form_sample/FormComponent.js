"use client";

import React, { useState, useEffect } from 'react';
import "../style.css"; // Ensure you have the correct path for your CSS

const initialFormState = {
  field1: '',
  field2: '',
  field3: '',
  field4: '',
  field5: '',
  field6: '',
  field7: '',
  field8: '',
  field9: '',
  field10: '',
};

export default function FormComponent() {
  const [formData, setFormData] = useState(() => {
    // Load the form data from localStorage if it exists, otherwise use the initial state
    const savedFormData = localStorage.getItem('formData');
    return savedFormData ? JSON.parse(savedFormData) : initialFormState;
  });

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace this with your actual send function
    console.log('Form Data JSON:', JSON.stringify(formData));
  };

  const handleClearAll = () => {
    setFormData(initialFormState);
    localStorage.removeItem('formData');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              {`Field ${index + 1}`}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                boxSizing: 'border-box',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
        ))}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Send
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear All
        </button>
      </form>
    </div>
  );
}
