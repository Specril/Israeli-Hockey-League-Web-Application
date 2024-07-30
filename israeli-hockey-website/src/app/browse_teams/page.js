"use client";

import "../style.css";
import { useEffect, useState } from "react";
import { Flex } from "antd";
import TeamOverview from "./TeamOverview";

// Define SQL queries
const query_team_details = `SELECT 
    Teams.Team_ID AS "Team ID",
    Users.Full_Name AS "Team Coach",
    TeamsLogos.Photo AS "Team Logo",
    Teams.Team_Name AS "Team Name",
    League.League_ID AS "League ID",
    League.Age AS "League Name"
FROM Teams
INNER JOIN CoachesOfTeams ON Teams.Team_ID = CoachesOfTeams.Team_ID
INNER JOIN UsersCoaches ON CoachesOfTeams.User_ID = UsersCoaches.User_ID
INNER JOIN Users ON UsersCoaches.User_ID = Users.User_ID
LEFT JOIN TeamsLogos ON Teams.Team_ID = TeamsLogos.Team_ID
INNER JOIN TeamsInLeagues ON Teams.Team_ID = TeamsInLeagues.Team_ID
INNER JOIN League ON TeamsInLeagues.League_ID = League.League_ID
ORDER BY Teams.Team_Name;
`;

const query_team_players = `SELECT 
    Teams.Team_Name AS "Team Name",
    Teams.Team_ID AS "Team ID",
    PlayerUsers.Full_Name AS "Player Name"
FROM Teams
INNER JOIN PlayersInTeams ON Teams.Team_ID = PlayersInTeams.Team_ID
INNER JOIN Users AS PlayerUsers ON PlayersInTeams.User_ID = PlayerUsers.User_ID
ORDER BY Teams.Team_Name, PlayerUsers.Full_Name;
`;

// Function to fetch data from the API
async function fetchData(query) {
  let data = [];
  try {
    const response = await fetch(`/api/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

const Home = () => {
  const [dataTeamDetails, setDataTeamDetails] = useState([]);
  const [dataTeamPlayers, setDataTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const details = await fetchData(query_team_details);
      const players = await fetchData(query_team_players);

      setDataTeamDetails(details);
      setDataTeamPlayers(players);
      setLoading(false);
    };

    fetchDataAsync();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TeamOverview details={dataTeamDetails} players={dataTeamPlayers} />
    </>
  );
};

export default Home;
