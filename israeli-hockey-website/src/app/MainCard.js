"use client"
import React from "react";
import { Card, Table } from "antd";

const columns = [
  { 
    title: "שם קבוצה", 
    dataIndex: "שם הקבוצה", 
    key: "שם הקבוצה", 
    align: "right", // Align text to the right
    render: (text) => <strong>{text}</strong> // Render team name in bold
  },
  { 
    title: "משחקים", 
    dataIndex: "משחקים", 
    key: "משחקים", 
    align: "right" // Align text to the right
  },
  { 
    title: "הפרש", 
    dataIndex: "הפרש", 
    key: "הפרש", 
    align: "right" // Align text to the right
  },
  { 
    title: "נקודות", 
    dataIndex: "נקודות", 
    key: "נקודות", 
    align: "right" // Align text to the right
  },
  {
    title: "לוגו",
    dataIndex: "Logo",
    key: "Logo",
    align: "center", // Center align the logo column
    render: (text, record) => (
      record.Logo ? (
        isBase64Image(record.Logo) ? (
          <img src={record.Logo} alt={record['שם הקבוצה']} style={{ width: 40 }} />
        ) : (
          <span>No Logo</span>
        )
      ) : (
        <span>No Logo</span>
      )
    ),
  },
];

// Helper function to check if a string is a base64 image
const isBase64Image = (str) => {
  return typeof str === 'string' && str.startsWith("data:image/");
};

const PremierLeagueTable = ({ data, name }) => {
  const tableRowClassName = () => "table-row-no-hover"; // Custom class to remove row line

  return (
    <Card
      title={<div style={{ textAlign: 'center', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1e90ff', borderRadius: '8px', padding: '8px' }}>{name}</div>}
      bordered={false}
      style={{ width: 800, borderRadius: '8px' }}
      headStyle={{ backgroundColor: '#1e90ff', borderRadius: '8px 8px 0 0' }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={true} // Show table header
        rowClassName={tableRowClassName} // Apply custom row class
        rowKey={(record) => record['שם הקבוצה']}
        bordered={false} // Remove table border
        size="middle" // Adjust table size if needed
      />
    </Card>
  );
};

export default PremierLeagueTable;
