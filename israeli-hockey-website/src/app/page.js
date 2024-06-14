import Button from "./Button";
import "./style.css";
import { fetchTeams } from "./api/fetchTeams";
import Example from "./Example";

export default async function Home() {
  const fetchTeams = require("./api/fetchTeams");
  let teamsData;
  async function dataFetchTeams() {
    try {
      teamsData = await fetchTeams();
      console.log("Teams fetched NOW:", teamsData);
      // Optionally, perform assertions to validate the data structure or content
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  }
  dataFetchTeams();
  console.log("TEAMS:" + teamsData);
  return (
    <>
      <Example></Example>
    </>
  );
}
