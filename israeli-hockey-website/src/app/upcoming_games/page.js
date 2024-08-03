"use client"
// Import necessary dependencies
import React, { useEffect, useState } from "react";
import "../style.css";
import DropdownComponent from "./DropdownComponent";
import Table from "../Table";
import ProtectedPage from "../ProtectedPage/ProtectedPage";

// Define the queries
const query_age = "SELECT DISTINCT Age FROM League;";
const query_upcoming_games = `
  SELECT Away_Team_Age AS "גיל", Home_Team_Name AS "קבוצת בית", Away_Team_Name AS "קבוצת חוץ", Day AS "יום", Date AS "תאריך", Start_Time AS "זמן התחלה", Location AS "מיקום", First_referee AS "שופט 1", Users.Full_Name AS "שופט 2"
  FROM (SELECT Home_Team_ID, Home_Team_Name, Away_Team_ID, Teams.Age AS Away_Team_Age, Teams.Team_Name AS Away_Team_Name, Day, Date, Start_Time, Location, Referee_ID, Users.Full_Name AS first_referee, Second_Referee_ID
        FROM (SELECT Home_Team_ID, Team_Name AS Home_Team_Name, Away_Team_ID, Day, Date, Start_Time, Location, Referee_ID, Second_Referee_ID
              FROM Games
              INNER JOIN Teams ON Home_Team_ID = Team_ID
              WHERE Date > CURRENT_TIMESTAMP AND Games.League_ID = 1) AS T1
        LEFT JOIN Teams ON Away_Team_ID = Team_ID
        LEFT JOIN Users ON Referee_ID = user_ID) AS T_with_first_referee
  LEFT JOIN Users ON Second_Referee_ID = user_ID;
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

    const result = await response.json();
    // Ensure data is an array
    data = Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return data;
}

// React functional component
export default function Home() {
  const [dataUpcoming, setDataUpcoming] = useState([]);
  const [options, setOptions] = useState([]);

  // Fetch upcoming games data
  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const data = await fetchData(query_upcoming_games);
        setDataUpcoming(data);
      } catch (error) {
        console.error("Error fetching upcoming games:", error);
      }
    }
    fetchUpcoming();
  }, []);

  // Fetch age data
  useEffect(() => {
    async function fetchAges() {
      try {
        const data = await fetchData(query_age);
        const ageArray = data.map(obj => obj.Age);
        setOptions(ageArray);
      } catch (error) {
        console.error("Error fetching ages:", error);
      }
    }
    fetchAges();
  }, []);

  // Render the component
  return (
    <ProtectedPage content={
      <>
        <DropdownComponent options={options} data={dataUpcoming} />
      </>
    }
      allowed_user_types={[]}
    />
  );
}
