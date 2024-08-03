"use client"
import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
import ProtectedPage from "../ProtectedPage/ProtectedPage";


const query_users = 'SELECT User_ID, Full_Name FROM Users;';
const query_roles = 'SELECT Role_ID, Role_Name FROM Roles;';

async function fetchData(query) {
  let data = [];
  try {
    const response = await fetch(`/api/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    // Ensure data is an array
    data = Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return data;
}

async function dataFetchUsers() {
  const usersData = await fetchData(query_users);
  return usersData.map(user => ({ key: user.User_ID, value: user.Full_Name }));
}

async function dataFetchRoles() {
  const rolesData = await fetchData(query_roles);
  return rolesData.map(role => ({ key: role.Role_ID, value: role.Role_Name }));
}

export default async function Page() {
  const usersData = await dataFetchUsers();
  const rolesData = await dataFetchRoles();
  const combinedData = [usersData, rolesData];

  return (
    <ProtectedPage content={
      <FormComponent data={combinedData} />
    }
      allowed_user_types={["admin"]}
    />
  );
}
