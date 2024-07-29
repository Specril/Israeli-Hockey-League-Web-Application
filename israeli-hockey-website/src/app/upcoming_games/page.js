import Dropdown from "../Dropdown";
import ProtectedPage from "../ProtectedPage/ProtectedPage";
import "../style.css";
import Table from "../Table";

const query_upcoming_games = `select Home_Team_Name AS "קבוצת בית", Away_Team_Name AS "קבוצת חוץ", Day AS "יום", Date AS "תאריך", Start_Time AS "זמן התחלה", Location AS "מיקום", First_referee AS "שופט 1", Users.Full_Name as "שופט 2" from 

(Select Home_Team_ID, Home_Team_Name, Away_Team_ID, Teams.Team_Name as Away_Team_Name, Day, Date, Start_Time, Location, Referee_ID,Users.Full_Name AS first_referee, Second_Referee_ID From

(SELECT Home_Team_ID, Team_Name As Home_Team_Name, Away_Team_ID, Day,Date,Start_Time,Location, Referee_ID, Second_Referee_ID from Games 
INNER JOIN Teams ON Home_Team_ID = Team_ID
WHERE Date>CURRENT_TIMESTAMP AND Games.League_ID = 1) AS T1
LEFT JOIN 
Teams ON Away_Team_ID = Team_ID
LEFT JOIN Users 
On Referee_ID=user_ID) AS T_with_first_referee
LEFT JOIN Users on Second_Referee_ID = user_ID
;`;

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

export default async function Home() {
  // Fetch data on the server side
  const data_upcoming = await dataFetchUpcoming();
  const options = ["בוגרים"];
  return (
    <ProtectedPage content={
    <>
        <Dropdown options={options} name="בחירת ליגה"></Dropdown>
      <Table data={data_upcoming} name={"משחקים קרובים בליגה: בוגרים"} />
    </>
    }
    allowed_user_types={["admin"]}
     />
  );
}
