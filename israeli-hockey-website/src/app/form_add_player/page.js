

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
const fetchRows = require("../api/fetchRows");



const query_teams = `select DISTINCT teams.Team_ID, teams.Team_Name, league.Age from teams inner JOIN teamsInLeagues on teams.Team_ID=teamsInLeagues.Team_ID 
left join league on teamsInLeagues.league_id=league.league_id;`

const query_users =  'select Users.User_ID, Users.Full_Name from Users INNER JOIN UsersPlayers on Users.User_ID= UsersPlayers.User_ID;'

async function dataFetchTeams() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  const options = teamsData.map(team => ({ key: team.Team_ID, value: [team.Team_Name+ " "+ team.Age] }));;
  // console.log(options)
  return options
}

async function dataFetchUsers() {
  let usersData = [];
  try {
    usersData = await fetchRows(() => query_users);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  const options = usersData.map(user => ({ key: user.User_ID, value: user.Full_Name }));;
  // console.log(options)
  return options
}

export default async function Page() {

  const teamsData = await dataFetchTeams();
  const usersData = await dataFetchUsers();
  const combinedData = [teamsData, usersData]
  // console.log(old_data);



  return (
    <>
      <FormComponent data = {combinedData} />
      
    </>
  );
}