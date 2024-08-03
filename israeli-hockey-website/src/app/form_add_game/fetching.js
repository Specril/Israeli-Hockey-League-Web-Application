"use client";

import 'antd/dist/reset.css';
import "../style.css";

const query_leagues = `SELECT * from league;`
const query_teams =  `SELECT Teams.Team_ID, Team_Name, League.Age, League_Type, League.League_ID from Teams inner join teamsInLeagues on teamsInLeagues.Team_ID=Teams.Team_ID 
left join League on League.League_ID=teamsInLeagues.League_ID;`

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
        return await response.json();
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
            body: JSON.stringify({ query: query_leagues }),
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


export async function dataFetchLocations() {
    try {
        const response = await fetch(`/api/fetch`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: `SELECT * from Locations;` }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const locationsData = await response.json();
        const options = locationsData.map(location => ({ key: location.Location_ID, value: location.Location_Name }));;
        return options    
    } catch (error) {
        console.error("Error fetching locations", error);
        return []; // Return an empty array on error
    }
}


export async function dataFetchReferees() {
    try {
        const response = await fetch(`/api/fetch`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: `SELECT users.User_ID, users.Full_Name from users inner join UsersReferees on UsersReferees.User_ID=users.User_ID;` }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const refreesData = await response.json();
        const options = refreesData.map(referee => ({ key: referee.User_ID, value: referee.Full_Name }));;
        return options    
    } catch (error) {
        console.error("Error fetching locations", error);
        return []; // Return an empty array on error
    }
}
