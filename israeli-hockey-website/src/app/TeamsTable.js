// components/TeamsTable.js
"use client";
import { useEffect, useState } from "react";
import fetchTeams from "./api/fetchTeams";

const TeamsTable = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Team ID</th>
          <th>Team Name</th>
          <th>Location</th>
          {/* Add more columns as needed */}
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr key={team.TeamID}>
            <td>{team.TeamID}</td>
            <td>{team.TeamName}</td>
            <td>{team.Location}</td>
            {/* Render additional columns based on your database schema */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamsTable;
