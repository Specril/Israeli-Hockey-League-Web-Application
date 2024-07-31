import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
import { Date } from 'mssql';
const fetchRows = require("../api/fetchRows");



const queryGames = `select Game_ID, T_with_first_referee.League_ID, Age ,Home_Team_ID, Home_Team_Name, Away_Team_ID, Away_Team_Name, Day, Date, Start_Time from 

(Select Game_ID, T1.League_ID, Home_Team_ID, Home_Team_Name, Away_Team_ID, Teams.Team_Name as Away_Team_Name, Day, Date, Start_Time, Location, Referee_ID,Users.Full_Name AS first_referee, Second_Referee_ID From

(SELECT Games.League_ID, Game_ID, Home_Team_ID, Team_Name As Home_Team_Name, Away_Team_ID, Day,Date,Start_Time,Location, Referee_ID, Second_Referee_ID from Games 
INNER JOIN Teams ON Home_Team_ID = Team_ID
WHERE Games.League_ID = 1) AS T1
LEFT JOIN 
Teams ON Away_Team_ID = Team_ID
LEFT JOIN Users 
On Referee_ID=user_ID) AS T_with_first_referee
LEFT JOIN Users on Second_Referee_ID = user_ID
 left join League on League.League_ID=T_with_first_referee.League_ID;
;`


const queryGoals = `SELECT Goal_ID, Game_ID, Users.User_ID, Full_Name, Teams.Team_ID, Team_Name, Time_Stamp from Goals INNER JOIN Users On Users.User_ID=Goals.User_ID
INNER join Teams on Teams.Team_ID=Goals.Team_ID;`

const queryPenalties = `SELECT Penalty_ID, Game_ID, Users.User_ID, Full_Name, Teams.Team_ID, Team_Name, Time_Stamp from Penalties INNER JOIN Users On Users.User_ID=Penalties.User_ID
INNER join Teams on Teams.Team_ID=Penalties.Team_ID;`

const queryCards = `SELECT Card_ID, Game_ID, Users.User_ID, Full_Name, Teams.Team_ID, Team_Name, Time_Stamp, Card_Type from Cards INNER JOIN Users On Users.User_ID=Cards.User_ID
INNER join Teams on Teams.Team_ID=Cards.Team_ID;`

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


async function dataFetchGoals() {
  let goalsData = [];
  try {
    goalsData = await fetchRows(() => queryGoals);
  } catch (error) {
    console.error("Error fetching Games:", error);
  }

  // console.log(playersData)
  return goalsData
}


async function dataFetchPenalties() {
    let goalsData = [];
    try {
      goalsData = await fetchRows(() => queryPenalties);
    } catch (error) {
      console.error("Error fetching Games:", error);
    }
  
    // console.log(playersData)
    return goalsData
  }

  async function dataFetchCards() {
    let goalsData = [];
    try {
      goalsData = await fetchRows(() => queryCards);
    } catch (error) {
      console.error("Error fetching Games:", error);
    }
  
    // console.log(goalsData)
    return goalsData
  }


export default async function Page() {

  const games = await dataFetchGames();
  const goalsData = await dataFetchGoals()
  const penaltiesData= await dataFetchPenalties();
  const cardsData = await dataFetchCards();
  const combined_data = [games, goalsData, penaltiesData, cardsData]
  // console.log(combined_data);



  return (
    <>
      <FormComponent data = {combined_data} />
      
    </>
  );
}