import "../style.css";
import Table from "../Table";
import GoalKing from "./GoalKing";
import King from "./King";
import { Flex } from "antd";

// const query_goal_king = `
// SELECT Full_Name AS "שם השחקן", "כמות גולים" from
// Users INNER JOIN
// (SELECT Goals.User_ID, count(*) as "כמות גולים"
// from Goals
// group by User_ID) AS T1 on Users.User_ID=T1.User_ID
// order by "כמות גולים" DESC;`;
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
      <section>
        <Flex gap="large" align="start" justify="space-evenly">
          <King
            data={data_goal_king}
            header={"מלך השערים"}
            backgroundColorFirst={"blue"}
          />
          <King
            data={data_goal_king}
            header={"מלך האלימות"}
            backgroundColorFirst={"red"}
          />
        </Flex>
      </section>
    </>
  );
}
