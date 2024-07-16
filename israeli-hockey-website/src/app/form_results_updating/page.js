

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
import { Date } from 'mssql';
const fetchRows = require("../api/fetchRows");



const query_example = `select Game_ID, Home_Team_ID, Home_Team_Name, Away_Team_ID, Away_Team_Name, Day, Date, Start_Time, Location AS "מיקום", First_referee AS "שופט 1", Users.Full_Name as "שופט 2" from 

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

async function dataFetch() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_example);
  } catch (error) {
    console.error("Error fetching Games:", error);
  }
  console.log("hereeeeeeeee")
  const options = teamsData.map(game => ({ key: game.Game_ID, value: [game.Home_Team_Name, game. Away_Team_Name, game.Date] }));
  console.log("hereeeeeeeee")
  console.log(options)
  return options
}

export default async function Page() {

  const old_data = await dataFetch();
  // console.log(old_data);



  return (
    <>
      <FormComponent data = {old_data} />
      
    </>
  );
}