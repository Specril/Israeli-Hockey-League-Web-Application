"use client";

import "../style.css";
import { useEffect, useState } from "react";
import { Select, Spin, Alert } from "antd";
import TeamOverview from "./TeamOverview";
import ProtectedPage from "../ProtectedPage/ProtectedPage";


const { Option } = Select;

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

const query_leagues = `
SELECT 
    League_ID,
    Age,
    League_Type
FROM League
WHERE League_ID = 1 OR League_ID = 4
`;

const query_team_statistics = `
SELECT 
    T1.Team_ID AS 'Team_ID', 
    T1.Team_Name AS 'Team_Name', 
    COALESCE(T1.Total_Games, 0) AS Games, 
    (3 * COALESCE(win_count, 0) + COALESCE(tie_count, 0)) AS Points, 
    (COALESCE(total_goals, 0) - COALESCE(rivals_goals, 0)) AS Goal_Difference
FROM 
    (SELECT 
        Teams.Team_ID,
        Teams.Team_Name,
        COUNT(Games.Game_ID) AS Total_Games
    FROM 
        Teams
        LEFT JOIN (
            SELECT Home_Team_ID AS Team_ID, Game_ID
            FROM Games
            UNION ALL
            SELECT Away_Team_ID AS Team_ID, Game_ID
            FROM Games
        ) AS Games ON Teams.Team_ID = Games.Team_ID
    GROUP BY 
        Teams.Team_ID, 
        Teams.Team_Name
    ) AS T1
LEFT JOIN
    (SELECT 
        Winner_ID AS Team_ID, 
        COUNT(*) as win_count
    FROM 
        Games_with_winner 
    WHERE 
        Winner_ID != 0
    GROUP BY
        Winner_ID
    ) AS T2 ON T1.Team_ID = T2.Team_ID
LEFT JOIN
    (SELECT 
        Team_ID, 
        COUNT(*) as tie_count
    FROM 
        (SELECT Home_Team_ID AS Team_ID
        FROM Games_with_winner 
        WHERE Winner_ID = 0
        UNION ALL
        SELECT Away_Team_ID AS Team_ID
        FROM Games_with_winner 
        WHERE Winner_ID = 0
        ) AS combined
    GROUP BY
        Team_ID
    ) AS T3 ON T1.Team_ID = T3.Team_ID
LEFT JOIN
    (SELECT 
        Team_ID, 
        COUNT(*) as total_goals
    FROM 
        Goals
    GROUP BY 
        Team_ID
    ) AS T4 ON T1.Team_ID = T4.Team_ID
LEFT JOIN 
    (SELECT 
        home_team_id AS Team_ID, 
        SUM(away_team_goals) AS rivals_goals 
    FROM 
        games_with_winner 
    GROUP BY 
        home_team_id
    ) AS T5 ON T1.Team_ID = T5.Team_ID
ORDER BY 
    Points DESC;
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
    return null; // Return null to indicate an error
  }
}

const Home = () => {
  const [dataTeamDetails, setDataTeamDetails] = useState([]);
  const [dataTeamPlayers, setDataTeamPlayers] = useState([]);
  const [dataTeamStatistics, setDataTeamStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaguesAsync = async () => {
      const leaguesData = await fetchData(query_leagues);
      if (leaguesData) {
        setLeagues(leaguesData);
        if (leaguesData.length > 0) {
          setSelectedLeague(leaguesData[0].League_ID);
        }
      } else {
        setError("Failed to load leagues data");
      }
    };

    fetchLeaguesAsync();
  }, []);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const details = await fetchData(query_team_details);
      const players = await fetchData(query_team_players);
      const statistics = await fetchData(query_team_statistics);

      if (details && players && statistics) {
        setDataTeamDetails(details);
        setDataTeamPlayers(players);
        setDataTeamStatistics(statistics);
        setError(null); // Clear any previous error
      } else {
        setError("Failed to load team data");
      }
      setLoading(false);
    };

    fetchDataAsync();
  }, []);

  const handleLeagueChange = (value) => {
    setSelectedLeague(value);
  };

  if (loading) {
    return <Spin tip="טוען עמוד..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <ProtectedPage content={
    <>
      <Select
        style={{
          width: 200,
          alignContent: "center",
          margin: 20,
          alignSelf: "center",
        }}
        placeholder="Select a league"
        onChange={handleLeagueChange}
        value={selectedLeague}
      >
        {leagues.map((league) => (
          <Option key={league.League_ID} value={league.League_ID}>
            {`${league.Age}`}
          </Option>
        ))}
      </Select>
      <TeamOverview
        details={dataTeamDetails}
        players={dataTeamPlayers}
        statistics={dataTeamStatistics}
        league={selectedLeague}
      />
    </>
    }
    allowed_user_types={[]}
  />
  );
};

export default Home;
