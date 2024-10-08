"use client";

import "../style.css";
import { useEffect, useState } from "react";
import { Select, Spin, Alert } from "antd";
import TeamOverview from "./TeamOverview";
import ProtectedPage from "../ProtectedPage/ProtectedPage";

const { Option } = Select;

const query_leagues = `
SELECT 
    League_ID,
    Age,
    League_Type
FROM League
`;

// Function to fetch data from the API
async function fetchData(query) {
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

    const data = await response.json();
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
  const [leagues, setLeagues] = useState(null); // Initialize with null to check if data is fetched
  const [selectedLeague, setSelectedLeague] = useState(null); // Start with null
  const [error, setError] = useState(null);

  // Fetch leagues data on initial load
  useEffect(() => {
    const fetchLeaguesAsync = async () => {
      const leaguesData = await fetchData(query_leagues);
      if (leaguesData && Array.isArray(leaguesData)) {
        setLeagues(leaguesData);
        if (leaguesData.length > 0) {
          setSelectedLeague(leaguesData[0].League_ID);
        }
      } else {
        setError("Failed to load leagues data");
        setLeagues([]); // Set an empty array to prevent further errors
      }
    };

    fetchLeaguesAsync();
  }, []);

  useEffect(() => {
    const fetchDataAsync = async () => {
      if (!selectedLeague) return; // Avoid fetching if no league is selected
      
      // Modify queries to include the selectedLeague
      const teamDetailsQuery = `
        SELECT 
            Teams.Team_ID AS "Team ID",
            Users.Full_Name AS "Team Coach",
            TeamsLogos.Photo AS "Team Logo",
            Teams.Team_Name AS "Team Name",
            League.League_ID AS "League ID",
            League.Age AS "League Name"
        FROM Teams
        LEFT JOIN CoachesOfTeams ON Teams.Team_ID = CoachesOfTeams.Team_ID
        LEFT JOIN UsersCoaches ON CoachesOfTeams.User_ID = UsersCoaches.User_ID
        LEFT JOIN Users ON UsersCoaches.User_ID = Users.User_ID
        LEFT JOIN TeamsLogos ON Teams.Team_ID = TeamsLogos.Team_ID
        LEFT JOIN TeamsInLeagues ON Teams.Team_ID = TeamsInLeagues.Team_ID
        LEFT JOIN League ON TeamsInLeagues.League_ID = League.League_ID
        WHERE League.League_ID = ${selectedLeague}
        ORDER BY Teams.Team_Name;
      `;
      
      const playersQuery = `
        SELECT 
            Teams.Team_Name AS "Team Name",
            Teams.Team_ID AS "Team ID",
            PlayerUsers.Full_Name AS "Player Name"
        FROM Teams
        INNER JOIN PlayersInTeams ON Teams.Team_ID = PlayersInTeams.Team_ID
        INNER JOIN Users AS PlayerUsers ON PlayersInTeams.User_ID = PlayerUsers.User_ID
        WHERE Teams.Team_ID IN (SELECT Team_ID FROM TeamsInLeagues WHERE League_ID = ${selectedLeague})
        ORDER BY Teams.Team_Name, PlayerUsers.Full_Name;
      `;
  
      const statisticsQuery = `
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
                COUNT(DISTINCT Games.Game_ID) AS Total_Games
            FROM 
                Teams
                LEFT JOIN (
                    SELECT Home_Team_ID AS Team_ID, Game_ID
                    FROM Games
                    WHERE League_ID = ${selectedLeague}
                    UNION ALL
                    SELECT Away_Team_ID AS Team_ID, Game_ID
                    FROM Games
                    WHERE League_ID = ${selectedLeague}
                ) AS Games ON Teams.Team_ID = Games.Team_ID
            WHERE Teams.Team_ID IN (SELECT Team_ID FROM TeamsInLeagues WHERE League_ID = ${selectedLeague})
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
                AND Game_ID IN (SELECT Game_ID FROM Games WHERE League_ID = ${selectedLeague})
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
                AND Game_ID IN (SELECT Game_ID FROM Games WHERE League_ID = ${selectedLeague})
                UNION ALL
                SELECT Away_Team_ID AS Team_ID
                FROM Games_with_winner 
                WHERE Winner_ID = 0
                AND Game_ID IN (SELECT Game_ID FROM Games WHERE League_ID = ${selectedLeague})
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
            WHERE 
                Game_ID IN (SELECT Game_ID FROM Games WHERE League_ID = ${selectedLeague})
            GROUP BY 
                Team_ID
            ) AS T4 ON T1.Team_ID = T4.Team_ID
        LEFT JOIN 
            (SELECT 
                home_team_id AS Team_ID, 
                SUM(away_team_goals) AS rivals_goals 
            FROM 
                Games_with_winner 
            WHERE 
                Game_ID IN (SELECT Game_ID FROM Games WHERE League_ID = ${selectedLeague})
            GROUP BY 
                home_team_id
            ) AS T5 ON T1.Team_ID = T5.Team_ID
        ORDER BY 
            Points DESC;
      `;
  
      const details = await fetchData(teamDetailsQuery);
      const players = await fetchData(playersQuery);
      const statistics = await fetchData(statisticsQuery);
  
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
  }, [selectedLeague]); // Re-run when selectedLeague changes
  

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
        disabled={!leagues || leagues.length === 0} // Disable if leagues are not loaded
      >
        {leagues && leagues.length > 0 ? (
          leagues.map((league) => (
            <Option key={league.League_ID} value={league.League_ID}>
              {`${league.Age} - ${league.League_Type}`}
            </Option>
          ))
        ) : (
          <Option disabled>No leagues available</Option> // Fallback option
        )}
      </Select>
      {selectedLeague && (
        <TeamOverview
          details={dataTeamDetails}
          players={dataTeamPlayers}
          statistics={dataTeamStatistics}
          league={selectedLeague}
        />
      )}
    </>
    }
    allowed_user_types={[]}
  />
  );
};

export default Home;
