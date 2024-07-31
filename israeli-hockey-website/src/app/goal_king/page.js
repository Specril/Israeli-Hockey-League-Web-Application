"use client";

import "../style.css";
import Table from "../Table";
import GoalKing from "./GoalKing";
import King from "./King";
import { Flex } from "antd";
import { useEffect, useState } from "react";

const query_goal_king = `
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
ORDER BY "כמות גולים" DESC;
`;

const query_penalty_king = `
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
ORDER BY "כמות עונשים" DESC;
`;

async function fetchData(query) {
  let data = [];
  try {
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
    // Ensure data is an array
    data = Array.isArray(result) ? result : [];
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

const Home = () => {
  const [dataGoalKing, setDataGoalKing] = useState([]);
  const [dataPenaltyKing, setDataPenaltyKing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const data_goals = await fetchData(query_goal_king);
      const data_penalty = await fetchData(query_penalty_king);
      setDataGoalKing(data_goals);
      setDataPenaltyKing(data_penalty);
      setLoading(false);
    };

    fetchDataAsync();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section>
        <Flex gap="large" align="start" justify="space-evenly">
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
        </Flex>
      </section>
    </>
  );
};

export default Home;
