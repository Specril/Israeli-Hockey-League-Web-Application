"use client"
import React from "react";
import { Card, Table } from "antd";

const MainCardUpcomingGames = ({ data, name, cardHeight }) => {
  // Group data by date
  const groupedData = {};
  data.forEach((item) => {
    const date = item['תאריך'];
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push(item);
  });

  // Helper function to format date with day
  const formatDate = (dateString) => {
    const daysOfWeek = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'יום שבת'];
    const date = new Date(dateString);
    const day = daysOfWeek[date.getDay()]; // Get day of week
    const dayOfMonth = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}, ${dayOfMonth}-${month}-${year}`;
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Prepare columns
  const columns = [
    {
      dataIndex: "לוגו קבוצת בית",
      key: "לוגו קבוצת בית",
      align: "center",
      render: (text, record) => (
        record['לוגו קבוצת בית'] ? (
          <img src={record['לוגו קבוצת בית']} alt={record['קבוצת בית']} style={{ width: 40 }} />
        ) : (
          <span>No Logo</span>
        )
      )
    },
    {
      dataIndex: "קבוצת בית",
      key: "קבוצת בית",
      align: "right",
    },
    {
      dataIndex: "זמן התחלה",
      key: "זמן התחלה",
      align: "right",
      render: (text) => <span>{formatTime(text)}</span>
    },
    {
      dataIndex: "קבוצת חוץ",
      key: "קבוצת חוץ",
      align: "right"
    },
    {
      dataIndex: "לוגו קבוצת חוץ",
      key: "לוגו קבוצת חוץ",
      align: "center",
      render: (text, record) => (
        record['לוגו קבוצת חוץ'] ? (
          <img src={record['לוגו קבוצת חוץ']} alt={record['קבוצת חוץ']} style={{ width: 40 }} />
        ) : (
          <span>No Logo</span>
        )
      )
    }
  ];

  // Render sections for each date
  const dateSections = Object.keys(groupedData).map((date) => (
    <Card
      key={date}
      title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>{formatDate(date)}</div>}
      bordered={false}
      style={{ marginBottom: '10px', height: cardHeight || 'auto', padding: 0 }}
    >
      <Table
        columns={columns}
        dataSource={groupedData[date]}
        pagination={false}
        showHeader={false}
        bordered={false}
        size="middle"
        style={{ border: 'none', padding: 0 }} // Adjust table padding
        rowClassName={() => 'table-row-no-padding'} // Apply custom row class
      />
    </Card>
  ));

  return (
    <Card
      title={<div style={{ textAlign: 'center', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1e90ff', borderRadius: '0px', padding: '0px' }}>{name}</div>}
      bordered={false}
      style={{ width: 350, borderRadius: '2px', marginBottom: '0px', padding: 0 }} // Adjusted padding
      headStyle={{ backgroundColor: '#1e90ff', borderRadius: '8px 8px 0 0' }}
    >
      {dateSections}
    </Card>
  );
};

export default MainCardUpcomingGames;

