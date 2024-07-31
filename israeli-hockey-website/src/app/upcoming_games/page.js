"use client"
import "../style.css";
import DropdownComponent from "./DropdownComponent";
import Table from "../Table";

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

async function dataFetchUpcoming() {
  let teamsData = [];
  try {
    teamsData = await fetchData(query_upcoming_games);
  } catch (error) {
    console.error("Error fetching upcoming games:", error);
  }
  return teamsData;
}

async function dataAge() {
  let agesData = [];
  try {
    agesData = await fetchData(query_age);
  } catch (error) {
    console.error("Error fetching ages:", error);
  }
  const ageArray = agesData.map(obj => obj.Age);
  return ageArray;
}

export default async function Home() {
  const data_upcoming = await dataFetchUpcoming();
  const options = await dataAge();

  return (
    <>
      <DropdownComponent options={options} data={data_upcoming} />
    </>
  );
}
