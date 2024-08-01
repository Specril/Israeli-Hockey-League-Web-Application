"use client";

import 'antd/dist/reset.css';
import "../style.css";


const query_teams = 'select * from Teams;'
const query_league = 'SELECT DISTINCT Age from League;'

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
            body: JSON.stringify({ query: query_league }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const leaguesData = await response.json();
        const ageArray = leaguesData.map(obj => obj.Age);        
        return ageArray
    } catch (error) {
        console.error("Error fetching locations", error);
        return []; // Return an empty array on error
    }
}