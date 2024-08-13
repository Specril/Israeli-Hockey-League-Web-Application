"use client";

import 'antd/dist/reset.css';
import "../style.css";

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

