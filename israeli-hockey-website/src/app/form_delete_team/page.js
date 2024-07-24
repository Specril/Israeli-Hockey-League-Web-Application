

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
const fetchRows = require("../api/fetchRows");



const query_teams = 'select * from Teams;'

const query_league = 'SELECT DISTINCT Age from League;'

async function dataFetchTeams() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  // const options = teamsData.map(team => ({ key: team.Team_ID, value: team.Team_Name }));;
  // console.log(options)
  return teamsData
}

async function dataFetchLeagues() {
  let leagueData = [];
  try {
    leagueData = await fetchRows(() => query_league);
  } catch (error) {
    console.error("Error fetching leagues:", error);
  }

  // const options_league = leagueData.map(leauge => ({ key: leauge.Leauge_ID, value: leauge.Leauge_Name }));;
  const ageArray = leagueData.map(obj => obj.Age);
  return ageArray
}

export default async function Page() {

  const teams_data = await dataFetchTeams();
  const league_Data = await dataFetchLeagues()
  const combined_data = [teams_data, league_Data]
  console.log(combined_data);



  return (
    <>
      <FormComponent data = {combined_data} />
      
    </>
  );
}