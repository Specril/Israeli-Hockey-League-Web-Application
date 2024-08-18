"use client";

import "../style.css";
import { Flex, Select, Spin, Alert } from "antd";
import King from "./King";
import { useEffect, useState } from "react";
import ProtectedPage from "../ProtectedPage/ProtectedPage";

const { Option } = Select;

const query_goal_king = (leagueId) => `
SELECT 
    ROW_NUMBER() OVER (ORDER BY T1."כמות גולים" DESC) AS "מקום",
    Users.Full_Name AS "שם השחקן", 
    T1."כמות גולים", 
    TeamsLogos.Photo AS "סמל קבוצה",
    Teams.Team_Name AS "שם הקבוצה"
FROM Users 
INNER JOIN (
    SELECT Goals.User_ID, COUNT(*) AS "כמות גולים"
    FROM Goals
    GROUP BY Goals.User_ID
) AS T1 ON Users.User_ID = T1.User_ID
INNER JOIN PlayersInTeams ON Users.User_ID = PlayersInTeams.User_ID
LEFT JOIN TeamsLogos ON PlayersInTeams.Team_ID = TeamsLogos.Team_ID
LEFT JOIN Teams ON PlayersInTeams.Team_ID = Teams.Team_ID
INNER JOIN TeamsInLeagues ON Teams.Team_ID = TeamsInLeagues.Team_ID
WHERE TeamsInLeagues.League_ID = ${leagueId}
ORDER BY "כמות גולים" DESC;
`;

const query_penalty_king = (leagueId) => `
SELECT 
    ROW_NUMBER() OVER (ORDER BY T1."כמות עונשים" DESC) AS "מקום",
    Users.Full_Name AS "שם השחקן", 
    T1."כמות עונשים", 
    TeamsLogos.Photo AS "סמל קבוצה",
    Teams.Team_Name AS "שם הקבוצה"
FROM Users 
INNER JOIN (
    SELECT Penalties.User_ID, COUNT(*) AS "כמות עונשים"
    FROM Penalties
    GROUP BY Penalties.User_ID
) AS T1 ON Users.User_ID = T1.User_ID
INNER JOIN PlayersInTeams ON Users.User_ID = PlayersInTeams.User_ID
LEFT JOIN TeamsLogos ON PlayersInTeams.Team_ID = TeamsLogos.Team_ID
LEFT JOIN Teams ON PlayersInTeams.Team_ID = Teams.Team_ID
INNER JOIN TeamsInLeagues ON Teams.Team_ID = TeamsInLeagues.Team_ID
WHERE TeamsInLeagues.League_ID = ${leagueId}
ORDER BY "כמות עונשים" DESC;
`;

const query_leagues = `
SELECT 
    League_ID,
    Age,
    League_Type
FROM League
`;

async function fetchData(query) {
  let data = [];
  try {
    console.log("Fetching data with query:", query); // Log the query
    const response = await fetch(`/api/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Data received:", result); // Log the result
    data = Array.isArray(result) ? result : [];
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function fetchLeagues() {
  let leagues = [];
  try {
    const response = await fetch(`/api/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query_leagues }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    leagues = Array.isArray(result) ? result : [];
    return leagues;
  } catch (error) {
    console.error("Error fetching leagues:", error);
    return [];
  }
}

const Home = () => {
  const [dataGoalKing, setDataGoalKing] = useState([]);
  const [dataPenaltyKing, setDataPenaltyKing] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaguesAsync = async () => {
      const leaguesData = await fetchLeagues();
      setLeagues(leaguesData);
      if (leaguesData.length > 0) {
        setSelectedLeague(leaguesData[0].League_ID);
      }
    };

    fetchLeaguesAsync();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      const fetchDataAsync = async () => {
        try {
          console.log("Selected league changed to:", selectedLeague); // Log the selected league
          setLoading(true);
          const data_goals = await fetchData(query_goal_king(selectedLeague));
          const data_penalty = await fetchData(
            query_penalty_king(selectedLeague)
          );
          setDataGoalKing(data_goals);
          setDataPenaltyKing(data_penalty);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDataAsync();
    }
  }, [selectedLeague]);

  const handleLeagueChange = (value) => {
    setSelectedLeague(value);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin tip="טוען עמוד..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red", padding: "20px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <ProtectedPage
      content={
        <section>
          <Flex gap="large" align="start" justify="space-evenly">
            <Select
              style={{ width: 200 }}
              placeholder="Select a league"
              onChange={handleLeagueChange}
              value={selectedLeague}
              showSearch
              optionFilterProp="children"
            >
              {leagues.map((league) => (
                <Option key={league.League_ID} value={league.League_ID}>
                  {`${league.Age} - ${league.League_Type}`}
                </Option>
              ))}
            </Select>
            {selectedLeague && (
              <>
                <King
                  data={dataGoalKing}
                  header={"מלך השערים"}
                  backgroundColorFirst={"blue"}
                />
                <King
                  data={dataPenaltyKing}
                  header={"מלך העונשים"}
                  backgroundColorFirst={"red"}
                />
              </>
            )}
          </Flex>
        </section>
      }
      allowed_user_types={["player"]}
    />
  );
};

export default Home;
