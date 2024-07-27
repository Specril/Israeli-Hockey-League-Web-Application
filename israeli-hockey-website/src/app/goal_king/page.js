import "../style.css";
import Table from "../Table";
import ProtectedPage from "../ProtectedPage/ProtectedPage";

const query_goal_king = `
SELECT Full_Name AS "שם השחקן", "כמות גולים" from
Users INNER JOIN
(SELECT Goals.User_ID, count(*) as "כמות גולים"
from Goals
group by User_ID) AS T1 on Users.User_ID=T1.User_ID
order by "כמות גולים" DESC;`;

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
        <ProtectedPage content={<Table data={data_goal_king} name={"מלך השערים"} />} allowed_user_types={["player"]} />
    </>
  );
}
