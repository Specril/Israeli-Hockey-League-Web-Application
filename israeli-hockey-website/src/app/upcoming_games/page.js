import Dropdown from "../Dropdown";
import "../style.css";
import Table from "../Table";

const query_upcoming_games = `SELECT * from Games WHERE Date>CURRENT_TIMESTAMP;`;

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
    <>
        <Dropdown options={options} name="בחירת ליגה"></Dropdown>
      <Table data={data_upcoming} name={"משחקים קרובים בליגה: בוגרים"} />
    </>
  );
}
