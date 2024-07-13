"use client"
import React from "react";
import { Card, Table } from "antd";

const MainCardUpcomingGames = ({ data, name }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const columns = [
    {
      title: "קבוצת בית",
      dataIndex: "קבוצת בית",
      key: "קבוצת בית",
      align: "right",
      render: (text) => <strong>{text}</strong>
    },
    {
      title: "לוגו קבוצת בית",
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
      title: "קבוצת חוץ",
      dataIndex: "קבוצת חוץ",
      key: "קבוצת חוץ",
      align: "right"
    },
    {
      title: "לוגו קבוצת חוץ",
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
    },
    {
      title: "יום",
      dataIndex: "יום",
      key: "יום",
      align: "right",
      render: (text) => <span>{text}</span> // Assuming text is already formatted
    },
    {
      title: "תאריך",
      dataIndex: "תאריך",
      key: "תאריך",
      align: "right",
      render: (text) => <span>{formatDate(text)}</span>
    },
    {
      title: "זמן התחלה",
      dataIndex: "זמן התחלה",
      key: "זמן התחלה",
      align: "right",
      render: (text) => <span>{formatTime(text)}</span>
    }
  ];

  return (
    <Card
      title={<div style={{ textAlign: 'center', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1e90ff', borderRadius: '8px', padding: '8px' }}>{name}</div>}
      bordered={false}
      style={{ width: 800, borderRadius: '8px', marginBottom: '20px' }}
      headStyle={{ backgroundColor: '#1e90ff', borderRadius: '8px 8px 0 0' }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={true}
        bordered={false}
        size="middle"
        style={{ border: 'none' }}
      />
    </Card>
  );
};

export default MainCardUpcomingGames;
