"use client";
import React from "react";

export default function Table({ data, name }) {
  if (!data || data.length === 0) {
    return (
      <section id="table">
        <h2>{name}</h2>
        <table>
          <tr>אין מידע זמין</tr>
        </table>
      </section>
    );
  }
  const columns = Object.keys(data[0]);
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
              {columns.map((col) => {
                const cellValue = row[col];
                return (
                  <td key={col}>
                    {cellValue instanceof Date
                      ? cellValue.toISOString() // Convert Date to string
                      : cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
