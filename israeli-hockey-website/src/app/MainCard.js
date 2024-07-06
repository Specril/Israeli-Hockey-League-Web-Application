"use client"
import React from "react";
import { Card, Table } from "antd";


const data = [
  { key: 1, pos: 1, club: "Arsenal", pl: 0, gd: 0, pts: 0, logo: 'base64-image-string' },
  { key: 2, pos: 2, club: "Aston Villa", pl: 0, gd: 0, pts: 0, logo: 'base64-image-string' },
  // Add the rest of the teams here
];

const columns = [
  { title: "Pos", dataIndex: "pos", key: "pos" },
  { title: "Club", dataIndex: "club", key: "club", render: (text, record) => (
      <span>
        <img src={record.logo} alt={text} style={{ width: 20, marginRight: 8 }} />
        {text}
      </span>
    )
  },
  { title: "Pl", dataIndex: "pl", key: "pl" },
  { title: "GD", dataIndex: "gd", key: "gd" },
  { title: "Pts", dataIndex: "pts", key: "pts" },
];

const PremierLeagueTable = () => {
  return (
    <Card
      title={<div style={{ textAlign: 'center', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1e90ff', borderRadius: '8px', padding: '8px' }}>Premier League</div>}
      bordered={false}
      style={{ width: 300, borderRadius: '8px' }}
      headStyle={{ backgroundColor: '#1e90ff', borderRadius: '8px 8px 0 0' }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={false}
        rowClassName="table-row"
      />
    </Card>
  );
};

export default PremierLeagueTable;
