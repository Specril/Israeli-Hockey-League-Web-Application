"use client";

import 'antd/dist/reset.css';
import "../style.css";

const query_locations = 'select * from Locations';
const query_leagues = 'SELECT DISTINCT Age from League';

export async function dataFetchLeagues() {
    try {
        const response = await fetch(`/api/fetch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query_leagues }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Error fetching leagues", error);
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
            body: JSON.stringify({ query: query_locations }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const locationsData = await response.json();
        return locationsData.map(loc => ({ key: loc.Location_ID, value: loc.Location_Name }));
    } catch (error) {
        console.error("Error fetching locations", error);
        return []; // Return an empty array on error
    }
}
