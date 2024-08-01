"use client";


import 'antd/dist/reset.css';
import "../style.css";


export async function fetchData() {
    let leagueData = [];
    try {
      const response = await fetch(`/api/fetch`, { // Use relative URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'SELECT DISTINCT Age from League;' }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      leagueData = await response.json();
      return leagueData; // Return the parsed data
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
    return leagueData;
  }
  