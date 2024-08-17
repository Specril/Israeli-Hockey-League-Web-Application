"use client";
import React, { useEffect, useState } from "react";
import { Table, Typography, Row, Col } from "antd";
import "../style.css";

const { Title } = Typography;

// Define the queries
const query_age = "SELECT DISTINCT Age FROM League;";

const query_upcoming_games = `
  SELECT 
    League.Age AS "גיל", 
    Home_Team.Team_Name AS "קבוצת בית", 
    Away_Team.Team_Name AS "קבוצת חוץ", 
    Games.Day AS "יום", 
    Games.Date AS "תאריך", 
    Games.Start_Time AS "זמן התחלה", 
    Games.Location AS "מיקום", 
    First_Referee.Full_Name AS "שופט 1", 
    Second_Referee.Full_Name AS "שופט 2"
  FROM Games
  INNER JOIN Teams AS Home_Team ON Games.Home_Team_ID = Home_Team.Team_ID
  INNER JOIN Teams AS Away_Team ON Games.Away_Team_ID = Away_Team.Team_ID
  INNER JOIN League ON Games.League_ID = League.League_ID
  LEFT JOIN Users AS First_Referee ON Games.Referee_ID = First_Referee.user_ID
  LEFT JOIN Users AS Second_Referee ON Games.Second_Referee_ID = Second_Referee.user_ID
  WHERE Games.Date > CURRENT_TIMESTAMP 
  ORDER BY Games.Date ASC; 
`;

// Function to fetch data from the API
async function fetchData(query) {
  let data = [];
  try {
    const response = await fetch(`/api/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("API response:", result); // Log the API response
    data = Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return data;
}

// React functional component
export default function Home() {
  const [dataUpcoming, setDataUpcoming] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedAge, setSelectedAge] = useState(null); // State to hold selected age filter

  // Fetch upcoming games data
  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const data = await fetchData(query_upcoming_games);
        console.log("Upcoming games data:", data); // Log the fetched data
        setDataUpcoming(data);
      } catch (error) {
        console.error("Error fetching upcoming games:", error);
      }
    }
    fetchUpcoming();
  }, []);

  // Fetch age data
  useEffect(() => {
    async function fetchAges() {
      try {
        const data = await fetchData(query_age);
        console.log("Fetched ages:", data); // Log fetched age data
        const ageArray = data.map(obj => obj.Age.trim()); // Trim spaces
        setOptions([...new Set(ageArray)]); // Ensure unique options
      } catch (error) {
        console.error("Error fetching ages:", error);
      }
    }
    fetchAges();
  }, []);

  // Filtered data based on selected age
  const filteredData = selectedAge
    ? dataUpcoming.filter(row => row['גיל'] === selectedAge)
    : dataUpcoming;

  // Columns definition with filters
  const columns = [
    {
      title: 'גיל',
      dataIndex: 'גיל',
      key: 'גיל',
      filters: options.map(age => ({ text: age, value: age })),
      onFilter: (value, record) => record['גיל'].toString().trim() === value,
    },
    {
      title: 'קבוצת בית',
      dataIndex: 'קבוצת בית',
      key: 'קבוצת בית',
    },
    {
      title: 'קבוצת חוץ',
      dataIndex: 'קבוצת חוץ',
      key: 'קבוצת חוץ',
    },
    {
      title: 'יום',
      dataIndex: 'תאריך', // Use the date field to determine the day
      key: 'יום',
      render: (text) => {
        const date = new Date(text);
        const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        return daysOfWeek[date.getDay()];
      },
    },
    {
      title: 'תאריך',
      dataIndex: 'תאריך',
      key: 'תאריך',
      render: (text) => {
        const date = new Date(text);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
    {
      title: 'זמן התחלה',
      dataIndex: 'זמן התחלה',
      key: 'זמן התחלה',
      render: (text) => {
        const time = new Date(text);
        const hours = time.getUTCHours().toString().padStart(2, '0');
        const minutes = time.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      },
    },
    {
      title: 'מיקום',
      dataIndex: 'מיקום',
      key: 'מיקום',
    },
    {
      title: 'שופט 1',
      dataIndex: 'שופט 1',
      key: 'שופט 1',
    },
    {
      title: 'שופט 2',
      dataIndex: 'שופט 2',
      key: 'שופט 2',
    },
  ];

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>משחקים קרובים</Title>
      <Row gutter={16}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={filteredData} // Use filtered data
            rowKey={(record) => `${record['קבוצת בית']}-${record['תאריך']}`} // Ensure unique rowKey
            className="custom-table" // Apply custom table class
            sticky // Enable sticky header
            scroll={{ y: 400 }} // Enable vertical scrolling if needed
          />
        </Col>
      </Row>
    </div>
  );
}
