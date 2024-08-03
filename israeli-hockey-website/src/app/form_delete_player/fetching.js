"use client";

import 'antd/dist/reset.css';
import "../style.css";


const query_teams = `select DISTINCT teams.Team_ID, teams.Team_Name, league.Age from teams inner JOIN teamsInLeagues on teams.Team_ID=teamsInLeagues.Team_ID 
left join league on teamsInLeagues.league_id=league.league_id;`

const query_players = `SELECT Users.User_ID, Users.Full_Name, Team_ID from Users INNER JOIN PlayersInTeams on PlayersInTeams.User_ID=Users.User_ID `


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
        const teamsData = await response.json();
        const options = teamsData.map(team => ({ key: team.Team_ID, value: [team.Team_Name + " " + team.Age] }));;
        return options
    } catch (error) {
        console.error("Error fetching leagues", error);
        return []; // Return an empty array on error
    }
}



export async function dataFetchPlayers() {
    try {
        const response = await fetch(`/api/fetch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query_players }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();

    } catch (error) {
        console.error("Error fetching locations", error);
        return []; // Return an empty array on error
    }
}