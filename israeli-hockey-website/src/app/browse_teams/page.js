import "../style.css";
import { Flex } from "antd";
import Table from "../Table"
import TeamOverview from "./TeamOverview"

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
    TeamsLogos.Photo AS "תמונה של הלוגו",
    PlayerUsers.Full_Name AS "שם השחקן"
FROM Teams
INNER JOIN CoachesOfTeams ON Teams.Team_ID = CoachesOfTeams.Team_ID
INNER JOIN Users AS CoachUsers ON CoachesOfTeams.User_ID = CoachUsers.User_ID
INNER JOIN PlayersInTeams ON Teams.Team_ID = PlayersInTeams.Team_ID
INNER JOIN Users AS PlayerUsers ON PlayersInTeams.User_ID = PlayerUsers.User_ID
LEFT JOIN TeamsLogos ON Teams.Team_ID = TeamsLogos.Team_ID
ORDER BY Teams.Team_Name, PlayerUsers.Full_Name;
`;

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
`

const fetchRows = require("../api/fetchRows");

async function dataFetchTeamDetails() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_team_details);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}
async function dataFetchTeamPlayers() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_team_players);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

export default async function Home() {
  // Fetch data on the server side
  const data_team_details = await dataFetchTeamDetails();
  const data_team_players = await dataFetchTeamPlayers();

  return (
    <>
    <TeamOverview details={data_team_details} players={data_team_players}/>
    </>
  );
}
