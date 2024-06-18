import DropdownTable from "../DropdownTable";
import "../style.css";
import Table from "../Table";

const query_league_stats = `SELECT  Teams.Team_Name AS "שם קבוצה",  Users.Full_Name AS "שם שחקן", PlayersInTeams.Position AS "תפקיד", PlayersInTeams.Shirt_Number AS "מספר חולצה"
FROM Users inner join PlayersInTeams on PlayersInTeams.User_ID = Users.User_ID
RIGHT join Teams on Teams.Team_ID=PlayersInTeams.Team_ID
WHERE Teams.Team_ID=5; 
`;
const query_league_teams = `SELECT Team_Name FROM Teams;`

const fetchRows = require("../api/fetchRows");

async function dataFetchLeague() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_league_stats);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}
async function dataFetchTeams() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_league_teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

export default async function Home() {
  // Fetch data on the server side
  const data_league = await dataFetchLeague();
  const data_teams = await dataFetchTeams();

  console.log(JSON.stringify(data_teams));

  const leagueOptions = ["בוגרים"];

  // Parse the JSON string into a JavaScript object
  const jsonArray = JSON.parse(JSON.stringify(data_teams));

  // Map through the array to extract the team names
  const teamNames = jsonArray.map(team => team.Team_Name);
  return (
    <>
      <DropdownTable
        options={leagueOptions}
        name="בחירת ליגה"
      />
      <DropdownTable
        options={teamNames}
        name="בחירת קבוצה"
      />
      <Table data={data_league} name={"נתוני ליגה: בוגרים"} />
    </>
  );
}
