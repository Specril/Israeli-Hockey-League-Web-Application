// "use client";

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset


const updateData = require("../api/updateRows")
const fetchRows = require("../api/fetchRows");


const query_example = 'select * from Users where User_ID=1;'

async function dataFetch() {
  let teamsData = [];
  try {
    teamsData = await fetchRows(() => query_example);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
  return teamsData;
}

export default async function Page() {

  const old_data = await dataFetch();
  console.log(old_data);



  return (
    <>
      <FormComponent data = {old_data} />
      
    </>
  );
}
