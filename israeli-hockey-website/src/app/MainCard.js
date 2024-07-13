"use client"
import React from "react";
import { Card, Table, Tooltip } from 'antd';

const columns = [
  {
    title: "",
    dataIndex: "Logo",
    key: "Logo",
    align: "center",
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
  { 
    title: "שם קבוצה", 
    dataIndex: "שם הקבוצה", 
    key: "שם הקבוצה", 
    align: "right",
    render: (text) => <strong>{text}</strong>
  },
  { 
    title: (
      <Tooltip title="משחקים">
        מ
      </Tooltip>
    ), 
    dataIndex: "משחקים", 
    key: "משחקים", 
    align: "right"
  },
  { 
    title: (
      <Tooltip title="הפרש">
        ה
      </Tooltip>
    ), 
    dataIndex: "הפרש", 
    key: "הפרש", 
    align: "right"
  },
  { 
    title: (
      <Tooltip title="נקודות">
        נ
      </Tooltip>
    ), 
    dataIndex: "נקודות", 
    key: "נקודות", 
    align: "right"
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
      style={{ width: 350, borderRadius: '8px', marginBottom: '20px' }} // Adjusted marginBottom for spacing
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
        style={{ border: 'none' }} // Remove internal table borders
      />
    </Card>
  );
};

export default PremierLeagueTable;
