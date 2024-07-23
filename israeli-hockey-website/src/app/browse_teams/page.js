import "../style.css";
import { Flex } from "antd";
import Table from "../Table"

// const query_goal_king = `
// SELECT Full_Name AS "שם השחקן", "כמות גולים" from
// Users INNER JOIN
// (SELECT Goals.User_ID, count(*) as "כמות גולים"
// from Goals
// group by User_ID) AS T1 on Users.User_ID=T1.User_ID
// order by "כמות גולים" DESC;`;
const query_teams = `
SELECT 
    CoachUsers.Full_Name AS "שם מאמן",
    Teams.Team_Name AS "שם קבוצה",
    PlayerUsers.Full_Name AS "שם השחקן"
FROM Teams
INNER JOIN CoachesOfTeams ON Teams.Team_ID = CoachesOfTeams.Team_ID
INNER JOIN Users AS CoachUsers ON CoachesOfTeams.User_ID = CoachUsers.User_ID
INNER JOIN PlayersInTeams ON Teams.Team_ID = PlayersInTeams.Team_ID
INNER JOIN Users AS PlayerUsers ON PlayersInTeams.User_ID = PlayerUsers.User_ID
LEFT JOIN TeamsLogos ON Teams.Team_ID = TeamsLogos.Team_ID
ORDER BY Teams.Team_Name, PlayerUsers.Full_Name;

`;

const fetchRows = require("../api/fetchRows");

async function dataFetchTeams() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

export default async function Home() {
  // Fetch data on the server side
  const data_teams = await dataFetchTeams();

  return (
    <>
      <section>
        <Table data={data_teams}></Table>
      </section>
    </>
  );
}
