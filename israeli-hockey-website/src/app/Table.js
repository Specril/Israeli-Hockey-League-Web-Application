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
                  {row[col] instanceof Date ? row[col].toISOString() : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
