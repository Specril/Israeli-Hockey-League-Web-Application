"use client";

import 'antd/dist/reset.css';
import "../style.css";



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

export async function dataFetchGames() {
    try {
        const response = await fetch(`/api/fetch`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: queryGames }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Error fetching leagues", error);
        return []; // Return an empty array on error
    }
}