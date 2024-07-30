

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
const fetchRows = require("../api/fetchRows");


const query_teams =  `select Team_Name, teams.Team_ID, Teams.Age, league.League_Type, league.League_ID 
from teams inner join teamsInLeagues on teamsInLeagues.Team_ID=teams.Team_ID inner join league on league.League_ID=teamsInLeagues.League_ID;`

async function dataFetchTeams() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  //const options = teamsData.map(team => ({ key: team.Team_ID, value: [team.Team_Name+ " "+ team.Age+ " "+ team.League_Type] }));;
  // console.log(teamsData)
  const teamsOptions = teamsData.map(team => ({
    key: `${team.Team_ID}-${team.League_ID}`,
    value: {
      League_ID: team.League_ID,
      Team_Name: team.Team_Name,
      Age: team.Age,
      League_Type: team.League_Type
    }
  }));
  console.log(teamsOptions)
  return teamsOptions
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