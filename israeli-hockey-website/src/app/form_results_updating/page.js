

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
import { Date } from 'mssql';
const fetchRows = require("../api/fetchRows");



const queryGames = `select Game_ID, Home_Team_ID, Home_Team_Name, Away_Team_ID, Away_Team_Name, Day, Date, Start_Time from 

(Select  Game_ID, Home_Team_ID, Home_Team_Name, Away_Team_ID, Teams.Team_Name as Away_Team_Name, Day, Date, Start_Time, Location, Referee_ID,Users.Full_Name AS first_referee, Second_Referee_ID From

(SELECT Game_ID, Home_Team_ID, Team_Name As Home_Team_Name, Away_Team_ID, Day,Date,Start_Time,Location, Referee_ID, Second_Referee_ID from Games 
INNER JOIN Teams ON Home_Team_ID = Team_ID
WHERE Games.League_ID = 1) AS T1
LEFT JOIN 
Teams ON Away_Team_ID = Team_ID
LEFT JOIN Users 
On Referee_ID=user_ID) AS T_with_first_referee
LEFT JOIN Users on Second_Referee_ID = user_ID
;`


const queryPlayers = `SELECT PlayersInTeams.user_id, Full_Name, Team_ID FROM users inner join PlayersInTeams on PlayersInTeams.user_ID=users.user_ID;`

async function dataFetchGames() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => queryGames);
  } catch (error) {
    console.error("Error fetching Games:", error);
  }
  // console.log("hereeeeeeeee")
  // const options = teamsData.map(game => ({ key: game.Game_ID, value: [game.Home_Team_Name, game. Away_Team_Name, game.Date] }));

  // console.log(options)
  return teamsData
}


async function dataFetchPlayers() {
  let playersData = [];
  try {
    playersData = await fetchRows(() => queryPlayers);
  } catch (error) {
    console.error("Error fetching Games:", error);
  }

  // console.log(playersData)
  return playersData
}


export default async function Page() {

  const games = await dataFetchGames();
  const players = await dataFetchPlayers()
  const combined_data = [games, players]
  // console.log(combined_data);



  return (
    <>
      <FormComponent data = {combined_data} />
      
    </>
  );
}