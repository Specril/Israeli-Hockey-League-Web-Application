

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
const fetchRows = require("../api/fetchRows");



const query_leagues = `SELECT * from league;`
const query_teams =  `SELECT Team_ID, Team_Name, Age from Teams;`

async function dataFetchTeams() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  // const options = teamsData.map(team => ({ key: team.Team_ID, value: [team.Team_Name+ " "+ team.League_Name] }));;
  // console.log(options)
  return teamsData
}

async function dataFetchLeague() {
  let leaguesData = [];
  try {
    leaguesData = await fetchRows(() => query_leagues);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  const options = leaguesData.map(league => ({ key: league.League_ID, value: [league.Age+ " "+ league.League_Type] }));;
  // console.log(options)
  return options
}

export default async function AddGameForm() {

  const teamsData = await dataFetchTeams();
  const leaguesData = await dataFetchLeague();
  const combinedData = [teamsData, leaguesData]
  // console.log(old_data);



  return (
    <>
      <FormComponent data = {combinedData} />
      
    </>
  );
}