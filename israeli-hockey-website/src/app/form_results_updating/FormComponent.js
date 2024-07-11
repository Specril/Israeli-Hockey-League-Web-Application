"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import "../style.css"; // Ensure you have the correct path for your CSS

const { Title } = Typography;
const { Option } = Select;

const initialFormState = {
  selectedGameId: '',
  teamAGoals: [],
  teamBGoals: [],
};

const fieldLabels = {
  selectedGameId: 'בחר משחק',
  teamA: 'קבוצה א',
  teamB: 'קבוצה ב',
};

const games = [
  { id: '1', date: '2024-07-01', teams: 'Team A vs Team B', hour: '18:00', teamA: 'Team A', teamB: 'Team B' },
  { id: '2', date: '2024-07-02', teams: 'Team C vs Team D', hour: '20:00', teamA: 'Team C', teamB: 'Team D' },
  { id: '3', date: '2024-07-03', teams: 'Team E vs Team F', hour: '19:00', teamA: 'Team E', teamB: 'Team F' },
];

const players = {
  'Team A': ['Player A1', 'Player A2', 'Player A3'],
  'Team B': ['Player B1', 'Player B2', 'Player B3'],
  'Team C': ['Player C1', 'Player C2', 'Player C3'],
  'Team D': ['Player D1', 'Player D2', 'Player D3'],
  'Team E': ['Player E1', 'Player E2', 'Player E3'],
  'Team F': ['Player F1', 'Player F2', 'Player F3'],
};

export default function UploadGameResultForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedGame, setSelectedGame] = useState(null);
  const [form] = Form.useForm();

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));

    if (changedValues.selectedGameId) {
      const game = games.find(game => game.id === changedValues.selectedGameId);
      setSelectedGame(game);
    }
  };

  const handleAddGoal = (team) => {
    const goal = { player: '', time: '' };
    setFormData((prevData) => ({
      ...prevData,
      [team]: [...prevData[team], goal],
    }));
  };

  const handleGoalChange = (team, index, key, value) => {
    const newGoals = [...formData[team]];
    newGoals[index][key] = value;
    setFormData((prevData) => ({
      ...prevData,
      [team]: newGoals,
    }));
  };

  const handleSubmit = () => {
    alert('Form Data JSON: ' + JSON.stringify(formData));
    console.log('Form Data JSON:', JSON.stringify(formData));
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    setSelectedGame(null);
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס העלאת תוצאה למשחק</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={fieldLabels.selectedGameId}
              name="selectedGameId"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels.selectedGameId} is required`,
                },
              ]}
            >
              <Select
                value={formData.selectedGameId}
                onChange={(value) => handleChange({ selectedGameId: value })}
              >
                {games.map((game) => (
                  <Option key={game.id} value={game.id}>
                    {`${game.date} - ${game.teams} - ${game.hour}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {selectedGame && (
          <Row gutter={16}>
            <Col span={12}>
              <Title level={4}>{selectedGame.teamA}</Title>
              {formData.teamAGoals.map((goal, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        value={goal.player}
                        onChange={(value) => handleGoalChange('teamAGoals', index, 'player', value)}
                        placeholder="בחר שחקן"
                      >
                        {players[selectedGame.teamA].map((player) => (
                          <Option key={player} value={player}>
                            {player}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <Input
                        type="number"
                        placeholder="זמן (דקות)"
                        value={goal.time}
                        onChange={(e) => handleGoalChange('teamAGoals', index, 'time', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button onClick={() => handleAddGoal('teamAGoals')} block>
                הוסף גול
              </Button>
            </Col>
            <Col span={12}>
              <Title level={4}>{selectedGame.teamB}</Title>
              {formData.teamBGoals.map((goal, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        value={goal.player}
                        onChange={(value) => handleGoalChange('teamBGoals', index, 'player', value)}
                        placeholder="בחר שחקן"
                      >
                        {players[selectedGame.teamB].map((player) => (
                          <Option key={player} value={player}>
                            {player}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <Input
                        type="number"
                        placeholder="זמן (דקות)"
                        value={goal.time}
                        onChange={(e) => handleGoalChange('teamBGoals', index, 'time', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button onClick={() => handleAddGoal('teamBGoals')} block>
                הוסף גול
              </Button>
            </Col>
          </Row>
        )}
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <Button type="primary" htmlType="submit" block>
              Send
            </Button>
          </Col>
          <Col span={12}>
            <Button type="default" onClick={handleClearAll} block>
              Clear All
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
