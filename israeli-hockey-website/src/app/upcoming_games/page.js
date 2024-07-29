import "../style.css";
import DropdownComponent from "./DropdownComponent";
import Table from "../Table";

const query_age = "select distinct Age from League";
const query_upcoming_games = `
  select Away_Team_Age as "גיל", Home_Team_Name AS "קבוצת בית", Away_Team_Name AS "קבוצת חוץ", Day AS "יום", Date AS "תאריך", Start_Time AS "זמן התחלה", Location AS "מיקום", First_referee AS "שופט 1", Users.Full_Name as "שופט 2"
  from (Select Home_Team_ID, Home_Team_Name, Away_Team_ID, Teams.Age as Away_Team_Age, Teams.Team_Name as Away_Team_Name, Day, Date, Start_Time, Location, Referee_ID, Users.Full_Name AS first_referee, Second_Referee_ID
  From (SELECT Home_Team_ID, Team_Name As Home_Team_Name, Away_Team_ID, Day, Date, Start_Time, Location, Referee_ID, Second_Referee_ID
  from Games INNER JOIN Teams ON Home_Team_ID = Team_ID WHERE Date>CURRENT_TIMESTAMP AND Games.League_ID = 1) AS T1
  LEFT JOIN Teams ON Away_Team_ID = Team_ID LEFT JOIN Users On Referee_ID=user_ID) AS T_with_first_referee
  LEFT JOIN Users on Second_Referee_ID = user_ID;
`;

const fetchRows = require("../api/fetchRows");

async function dataFetchUpcoming() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_upcoming_games);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

async function dataAge() {
  let agesData = [];
  try {
    agesData = await fetchRows(() => query_age);
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