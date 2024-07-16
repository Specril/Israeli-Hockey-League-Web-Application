

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
const fetchRows = require("../api/fetchRows");



const query_example = 'select * from Teams;'

async function dataFetch() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_example);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  const options = teamsData.map(team => ({ key: team.Team_ID, value: team.Team_Name }));;
  return options
}

export default async function Page() {

  const old_data = await dataFetch();
  // console.log(old_data);



  return (
    <>
      <FormComponent data = {old_data} />
      
    </>
  );
}