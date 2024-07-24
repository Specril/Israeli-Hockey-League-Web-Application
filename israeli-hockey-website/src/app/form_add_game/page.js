

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
const fetchRows = require("../api/fetchRows");



const query_leagues = `SELECT * from league;`
const query_teams =  `SELECT Teams.Team_ID, Team_Name, League.Age, League_Type, League.League_ID from Teams inner join teamsInLeagues on teamsInLeagues.Team_ID=Teams.Team_ID 
left join League on League.League_ID=teamsInLeagues.League_ID;`

async function dataFetchTeams() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  // const options = teamsData.map(team => ({ key: team.Team_ID, value: [team.Team_Name+ " "+ team.League_Name] }));;
  // console.log(teamsData)
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


async function dataFetchLocations() {
  let locationsData = [];
  try {
    locationsData = await fetchRows(() => `SELECT * from Locations;`);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  const options = locationsData.map(location => ({ key: location.Location_ID, value: location.Location_Name }));;
  // console.log('hereeeeeeeee')
  // console.log(options)
  return options
}

async function dataFetchReferees() {
  let refreesData = [];
  try {
    refreesData = await fetchRows(() => `SELECT users.User_ID, users.Full_Name from users inner join UsersReferees on UsersReferees.User_ID=users.User_ID;`);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  const options = refreesData.map(referee => ({ key: referee.User_ID, value: referee.Full_Name }));;
  // console.log('hereeeeeeeee')
  // console.log(options)
  return options
}




export default async function AddGameForm() {

  const teamsData = await dataFetchTeams();
  const leaguesData = await dataFetchLeague();
  const locationsData = await dataFetchLocations()
  const refreesData = await dataFetchReferees()
  const combinedData = [teamsData, leaguesData, locationsData, refreesData]
  // console.log(old_data);



  return (
    <>
      <FormComponent data = {combinedData} />
      
    </>
  );
}