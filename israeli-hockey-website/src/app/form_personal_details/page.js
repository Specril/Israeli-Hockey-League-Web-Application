"use client";

import React, { useEffect, useState } from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
import { useAuth } from '../authentication/contexts/authContext';
import ProtectedPage from "../ProtectedPage/ProtectedPage";

const fetchData = async (userId) => {
  const query = `select * from Users where User_ID=${userId}`;
  let data = [];
  try {
    const response = await fetch(`/api/fetch`, { // Use relative URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    data = await response.json();
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return data;
};

export default function Page() {
  const { currentUser } = useAuth();
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (currentUser) {
      console.log('Current user:', currentUser);
      const userData = JSON.parse(currentUser.photoURL);
      console.log('User data:', userData);
      setUserId(userData.userID);
    }
  }, [currentUser]);

  useEffect(() => {
    if (userId) {
      fetchData(userId).then(fetchedData => {
        setData(fetchedData);
      });
    }
  }, [userId]);

  if (!currentUser) {
    return (
      <ProtectedPage content={
      <div>טוען עמוד...</div>
    }
    allowed_user_types={["player", "coach", "fan", "admin", "referee"]}
  />
    )
  }

  return (
    <ProtectedPage content={
      <FormComponent data={data} />
    }
      allowed_user_types={["player", "coach", "fan", "admin", "referee"]}
    />
  );
}
