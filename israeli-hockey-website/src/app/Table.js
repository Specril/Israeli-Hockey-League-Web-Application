"use client";
import React from "react";


export default function Table({ data, name }) {
  if (!data || data.length === 0) {
    return (
      <section id="table">
        <h2>{name}</h2>
        <table>
          <tbody>
            <tr>
              <td>אין מידע זמין</td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }

  const columns = Object.keys(data[0]);

  // Helper functions to format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getUTCHours().toString().padStart(2, '0');
    const minutes = time.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Helper function to check if a string is a base64 image
  const isBase64Image = (str) => {
    return typeof str === 'string' && str.startsWith("data:image/");
  };

  return (
    <section id="table">
      <h2>{name}</h2>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col}>
                  {col === 'תאריך'
                    ? formatDate(row[col])
                    : col === 'זמן התחלה'
                    ? formatTime(row[col])
                    : isBase64Image(row[col])
                    ? <img src={row[col]} alt="image" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
