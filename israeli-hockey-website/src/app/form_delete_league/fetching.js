"use client";

import 'antd/dist/reset.css';
import "../style.css";


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
        console.error("Error fetching leagues", error);
        return []; // Return an empty array on error
    }
}