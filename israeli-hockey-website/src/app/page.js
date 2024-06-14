import Button from "./Button";
import "./style.css";
import { fetchTeams } from "./api/fetchTeams";
import Example from "./Example";
import TeamsTable from "./TeamsTable";

export default async function Home() {
  const fetchTeams = require("./api/fetchTeams");
  async function dataFetchTeams() {
    let teamsData;
    try {
      teamsData = await fetchTeams();
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
