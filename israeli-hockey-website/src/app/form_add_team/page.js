

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

  // const options_league = leagueData.map(leauge => ({ key: leauge.Leauge_ID, value: leauge.Leauge_Name }));;
  const ageArray = leagueData.map(obj => obj.Age);
  console.log(ageArray)
  return ageArray
}


async function dataFetchLocations() {
  let locationsData = [];
  try {
    locationsData = await fetchRows(() => query_locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
  }

  const options_locations = locationsData.map(loc => ({ key: loc.Location_ID, value: loc.Location_Name }));;

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