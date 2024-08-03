"use client";

import 'antd/dist/reset.css';
import "../style.css";


const query_teams = `select Team_Name, Team_ID, Age from teams`

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
        const options = leaguesData.map(league => ({ key: league.League_ID, value: [league.Age + " " + league.League_Type] }));;
        return options
    } catch (error) {
        console.error("Error fetching locations", error);
        return []; // Return an empty array on error
    }
}
