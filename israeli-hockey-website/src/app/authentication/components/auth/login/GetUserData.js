import React from 'react';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset

const getUserType = async (userID) => {
  try {
    const response = await fetch(`/api/get_user_type?User_ID=${userID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('User type:', data);
    return data; // Return the parsed data
  } catch (error) {
    console.error('Error updating data', error);
    return null; // Return null or handle the error as needed
  }
};

const getUserID = async (uid) => {
  console.log("uid:", uid);
  try {
    const response = await fetch(`/api/get_User_ID?UID=${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data; // Return the parsed data
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null; // Return null or handle the error as needed
  }
};

export { getUserType, getUserID };
