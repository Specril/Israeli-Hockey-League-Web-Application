"use client";
import React from "react";

export default function TeamsTable({ teams }) {
  if (!teams) {
    return <p>No teams data available.</p>;
  }
  return (
    <section id="teams-table">
      <h2>קבוצות</h2>
      <table>
        <thead>
          <tr>
            <th>Team ID</th>
            <th>Team Name</th>
            <th>Rank</th>
            <th>Location ID</th>
            <th>League ID</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.Team_ID}>
              <td>{team.Team_ID}</td>
              <td>{team.Team_Name}</td>
              <td>{team.Rank}</td>
              <td>{team.Location_ID}</td>
              <td>{team.League_ID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
