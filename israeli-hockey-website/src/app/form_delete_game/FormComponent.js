"use client";

import React, { useState, useEffect } from 'react';
import { Table, Button, Typography } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";
import moment from 'moment';
import { dataFetchGames } from './fetching';

const { Title } = Typography;

export default function DeleteGamePage() {
  const [games, setGames] = useState([]);
  const [selectedGameIds, setSelectedGameIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedGames = await dataFetchGames();

      setGames(fetchedGames);
    };
    fetchData();
  }, []); 

  const handleSelectChange = (selectedRowKeys) => {
    setSelectedGameIds(selectedRowKeys);
  };

  const handleDelete = async () => {
    const payload = {
      game_ids: selectedGameIds,
    };

    alert('Form Data JSON: ' + JSON.stringify(payload));

    try {
      const response = await fetch('/api/form_manage_game', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Optionally, update the table by removing the deleted games
        setGames(games.filter(game => !selectedGameIds.includes(game.Game_ID)));
        setSelectedGameIds([]); // Clear the selected games
      }
    } catch (error) {
      console.error('Error deleting games:', error);
    }
  };



  const columns = [
    // { title: 'Game ID', dataIndex: 'Game_ID', key: 'Game_ID' },
    { title: 'גיל', dataIndex: 'Age', key: 'Age' },
    { title: 'קבוצת בית', dataIndex: 'Home_Team_Name', key: 'Home_Team_Name' },
    { title: 'קבוצת חוץ', dataIndex: 'Away_Team_Name', key: 'Away_Team_Name' },
    { title: 'יום', dataIndex: 'Day', key: 'Day' },
    { title: 'תאריך', dataIndex: 'Date', key: 'Date' , render: (text) => moment(text).format('YYYY-MM-DD')},
    { title: 'זמן התחלה', dataIndex: 'Start_Time', key: 'Start_Time', render: (text) => moment(text, 'HH:mm').format('HH:mm') },
  ];

  const rowSelection = {
    selectedRowKeys: selectedGameIds,
    onChange: handleSelectChange,
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>מחיקת משחקים</Title>
      <Table
        rowSelection={rowSelection}
        dataSource={games}
        columns={columns}
        rowKey="Game_ID"
        pagination={{ pageSize: 10 }}
      />
      <Button
        type="primary"
        danger
        onClick={handleDelete}
        disabled={selectedGameIds.length === 0}
        style={{ marginTop: '20px' }}
      >
        מחק את הרשומות
      </Button>
    </div>
  );
}
