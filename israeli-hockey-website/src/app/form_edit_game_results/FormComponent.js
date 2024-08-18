

"use client";

import React, { useState, useEffect } from 'react';
import { Form, Button, Typography, Row, Col, Select, Table } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

export default function EditGameInfo({ data }) {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedPenalties, setSelectedPenalties] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [penaltiesData, setPenaltiesData] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();


  // Assuming `data` contains games, goals, penalties, and cards information
  const games = data[0].map(game => ({
    key: game.Game_ID,
    value: {
      Age: game.Age,
      Home_Team_Name: game.Home_Team_Name,
      Away_Team_Name: game.Away_Team_Name,
      Day: game.Day,
      Date: game.Date
    }
  }));

  const goals = data[1]; // Goals data
  const penalties = data[2]; // Penalties data
  const cards = data[3]; // Cards data

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleGameSelect = (gameId) => {
    setSelectedGameId(gameId);
  
    // Filter the goals, penalties, and cards for the selected game
    const filteredGoals = goals.filter(goal => goal.Game_ID === gameId);
    const filteredPenalties = penalties.filter(penalty => penalty.Game_ID === gameId);
    const filteredCards = cards.filter(card => card.Game_ID === gameId);
    console.log("Filtered Goals: ", filteredGoals);
    console.log("Filtered Penalties: ", filteredPenalties);
    console.log("Filtered Cards: ", filteredCards);
    
    setGoalsData(filteredGoals);
    setPenaltiesData(filteredPenalties);
    setCardsData(filteredCards);
  };
  

  const handleGoalSelect = (selectedRowKeys) => setSelectedGoals(selectedRowKeys);
  const handlePenaltySelect = (selectedRowKeys) => setSelectedPenalties(selectedRowKeys);
  const handleCardSelect = (selectedRowKeys) => setSelectedCards(selectedRowKeys);

  const handleSubmit = async () => {
    const finalData = {
      Game_ID: selectedGameId,
      Goal_IDs: selectedGoals,
      Penalty_IDs: selectedPenalties,
      Card_IDs: selectedCards,
    };
  
    alert('just an alert');
  
    try {
      const response = await fetch('/api/form_results_updating', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });
  
      if (response.ok) {
        window.location.reload(); // Refresh the page after successful submission
      } else {
        console.error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  

  const columns = {
    goals: [
  
 
      { title: 'שם מלא', dataIndex: 'Full_Name', key: 'Full_Name' },
      { title: 'קבוצה', dataIndex: 'Team_Name', key: 'Team_Name' },
      { title: 'זמן', dataIndex: 'Time_Stamp', key: 'Time_Stamp', render: (text) => moment(text, 'HH:mm').format('HH:mm') },
    ],
    penalties: [

      { title: 'שם מלא', dataIndex: 'Full_Name', key: 'Full_Name' },
      { title: 'קבוצה', dataIndex: 'Team_Name', key: 'Team_Name' },
      { title: 'זמן', dataIndex: 'Time_Stamp', key: 'Time_Stamp', render: (text) => moment(text, 'HH:mm').format('HH:mm') },
    ],
    cards: [

      { title: 'שם מלא', dataIndex: 'Full_Name', key: 'Full_Name' },
      { title: 'קבוצה', dataIndex: 'Team_Name', key: 'Team_Name' },
      { title: 'זמן', dataIndex: 'Time_Stamp', key: 'Time_Stamp', render: (text) => moment(text, 'HH:mm').format('HH:mm') },
      { title: 'כרטיס', dataIndex: 'Card_Type', key: 'Card_Type' },
    ],
  };

  const rowSelection = {
    goals: {
      selectedRowKeys: selectedGoals,
      onChange: handleGoalSelect,
    },
    penalties: {
      selectedRowKeys: selectedPenalties,
      onChange: handlePenaltySelect,
    },
    cards: {
      selectedRowKeys: selectedCards,
      onChange: handleCardSelect,
    },
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>עריכת תוצאות משחק</Title>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="בחר משחק"
              name="selectedGameId"
              rules={[{ required: true, message: 'Please select a game' }]}
            >
              <Select
                value={selectedGameId}
                onChange={handleGameSelect}
                style={{ width: '100%' }}
              >
                {games.map((game) => (
                  <Option key={game.key} value={game.key}>
                    {`משחק ${game.key}: ${moment(game.value['Date']).format('YYYY-MM-DD')} - קבוצות ${game.value['Home_Team_Name']} מול ${game.value['Away_Team_Name']} ליגת ${game.value['Age']}`}
                    </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {selectedGameId && (
          <>
            <Row gutter={16}>
              <Col span={24}>
                <Title level={4}>גולים</Title>
                <Table
                  rowSelection={rowSelection.goals}
                  columns={columns.goals}
                  dataSource={goalsData}
                  rowKey="Goal_ID"
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Title level={4}>עבירות</Title>
                <Table
                  rowSelection={rowSelection.penalties}
                  columns={columns.penalties}
                  dataSource={penaltiesData}
                  rowKey="Penalty_ID"
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Title level={4}>כרטיסים</Title>
                <Table
                  rowSelection={rowSelection.cards}
                  columns={columns.cards}
                  dataSource={cardsData}
                  rowKey="Card_ID"
                />
              </Col>
            </Row>
          </>
        )}
        {selectedGameId&&(
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <Button type="primary" htmlType="submit" block>
              מחק את הרשומות
            </Button>
          </Col>
        </Row>)}
      </Form>
    </div>
  );
}