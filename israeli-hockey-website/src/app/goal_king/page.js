import "../style.css";
import Table from "../Table";
import GoalKing from "./GoalKing";

// const query_goal_king = `
// SELECT Full_Name AS "שם השחקן", "כמות גולים" from
// Users INNER JOIN
// (SELECT Goals.User_ID, count(*) as "כמות גולים"
// from Goals
// group by User_ID) AS T1 on Users.User_ID=T1.User_ID
// order by "כמות גולים" DESC;`;
const query_goal_king = `
SELECT Users.Full_Name AS "שם השחקן", 
       T1."כמות גולים", 
       TeamsLogos.Photo AS "סמל קבוצה"
FROM Users 
INNER JOIN (
    SELECT Goals.User_ID, COUNT(*) AS "כמות גולים"
    FROM Goals
    GROUP BY Goals.User_ID
) AS T1 ON Users.User_ID = T1.User_ID
INNER JOIN PlayersInTeams ON Users.User_ID = PlayersInTeams.User_ID
LEFT JOIN TeamsLogos ON PlayersInTeams.Team_ID = TeamsLogos.Team_ID
ORDER BY "כמות גולים" DESC;
`;

const fetchRows = require("../api/fetchRows");

async function dataFetchGoalKing() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_goal_king);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

export default async function Home() {
  // Fetch data on the server side
  const data_goal_king = await dataFetchGoalKing();

  return (
    <>
      <GoalKing data={data_goal_king} />
    </>
  );
}
