
import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
const fetchRows = require("../api/fetchRows");

const query_users = 'SELECT User_ID, Full_Name FROM Users;';
const query_roles = 'SELECT Role_ID, Role_Name FROM Roles;';

async function dataFetchUsers() {
  let usersData = [];
  try {
    usersData = await fetchRows(() => query_users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  return usersData.map(user => ({ key: user.User_ID, value: user.Full_Name }));
}

async function dataFetchRoles() {
  let rolesData = [];
  try {
    rolesData = await fetchRows(() => query_roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
  return rolesData.map(role => ({ key: role.Role_ID, value: role.Role_Name }));
}


export default async function Page() {
  const usersData = await dataFetchUsers();
  const rolesData = await dataFetchRoles();
  const combinedData = [usersData, rolesData];

  return (
    <>
      <FormComponent data={combinedData} />
    </>
  );
}