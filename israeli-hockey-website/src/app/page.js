import Button from "./Button";
import "./style.css";
import { fetchTeams } from "./api/fetchTeams";
import Example from "./Example";
import TeamsTable from "./TeamsTable";

export default async function Home() {
  const fetchRows = require("./api/fetchRows");
  async function dataFetchTeams() {
    let teamsData;
    try {
      teamsData = await fetchRows(() => "SELECT * FROM Teams WHERE Team_ID=3");
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
    return teamsData;
  }
  const data = await dataFetchTeams();
  console.log("TEAMS:" + JSON.stringify(data));
  return (
    <>
      <TeamsTable teams={data} />
    </>
  );
}
