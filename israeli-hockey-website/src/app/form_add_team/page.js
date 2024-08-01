

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
const fetchRows = require("../api/fetchRows");



const query_league = 'SELECT DISTINCT Age from League;'
const query_locations = 'select * from Locations'

async function dataFetchLeagues() {
  let leagueData = [];
  try {
    leagueData = await fetchRows(() => query_league);
  } catch (error) {
    console.error("Error fetching leagues:", error);
  }

  const ageArray = leagueData.map(obj => obj.Age);
  console.log(ageArray)
  return ageArray
}

// async function dataFetchLeagues() {
//   let leagueData = [];
//   try {
//     const response = await fetch(`/api/fetch`, { // Use relative URL
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ query: 'SELECT DISTINCT Age from League;' }),
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     leagueData = await response.json();
//     return leagueData; // Return the parsed data
//   } catch (error) {
//     console.error("Error fetching photos:", error);
//   }
//   const ageArray = leagueData.map(obj => obj.Age);
//   return ageArray;
// }



async function dataFetchLocations() {
  let locationsData = [];
  try {
    locationsData = await fetchRows(() => query_locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
  }

  const options_locations = locationsData.map(loc => ({ key: loc.Location_ID, value: loc.Location_Name }));;
  console.log(options_locations)
  return options_locations
}

export default async function Page() {

  const leaguesData = await dataFetchLeagues();
  const locationsData = await dataFetchLocations();
  const all_data = [leaguesData,locationsData]
  // console.log(all_data[1])




  return (
    <>
      <FormComponent data = {all_data} />
      
    </>
  );
}