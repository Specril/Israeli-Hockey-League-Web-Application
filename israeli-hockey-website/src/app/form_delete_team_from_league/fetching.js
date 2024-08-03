"use client";

import 'antd/dist/reset.css';
import "../style.css";



const query_teams =  `select Team_Name, teams.Team_ID, Teams.Age, league.League_Type, league.League_ID 
from teams inner join teamsInLeagues on teamsInLeagues.Team_ID=teams.Team_ID inner join league on league.League_ID=teamsInLeagues.League_ID;`


export async function dataFetchTeams() {
    try {
        const response = await fetch(`/api/fetch`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query_teams }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const teamsData=await response.json();
        const teamsOptions = teamsData.map(team => ({
            key: `${team.Team_ID}-${team.League_ID}`,
            value: {
              League_ID: team.League_ID,
              Team_Name: team.Team_Name,
              Age: team.Age,
              League_Type: team.League_Type
            }
          }));
          return teamsOptions
    } catch (error) {
        console.error("Error fetching leagues", error);
        return []; // Return an empty array on error
    }
}

export async function dataFetchLeague() {
    try {
        const response = await fetch(`/api/fetch`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: `SELECT * from league;` }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const leaguesData = await response.json();
        const options = leaguesData.map(league => ({ key: league.League_ID, value: [league.Age+ " "+ league.League_Type] }));;
        return options
    } catch (error) {
        console.error("Error fetching locations", error);
        return []; // Return an empty array on error
    }
}