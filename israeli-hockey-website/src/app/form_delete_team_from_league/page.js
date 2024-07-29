

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
const fetchRows = require("../api/fetchRows");


const query_teams =  `select Team_Name, Team_ID, Age from teams`

async function dataFetchTeams() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  const options = teamsData.map(team => ({ key: team.Team_ID, value: [team.Team_Name+ " "+ team.Age] }));;
  // console.log(teamsData)
  return options
}

async function dataFetchLeague() {
  let leaguesData = [];
  try {
    leaguesData = await fetchRows(() => `SELECT * from league;`);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  const options = leaguesData.map(league => ({ key: league.League_ID, value: [league.Age+ " "+ league.League_Type] }));;
  // console.log(options)
  return options
}

export default async function Page() {

  const teamsData = await dataFetchTeams();
  const leaguesData = await dataFetchLeague();

  const all_data = [teamsData, leaguesData]
  // console.log(all_data[1])




  return (
    <>
      <FormComponent data = {all_data} />
      
    </>
  );
}