"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, TimePicker } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import "../style.css";
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

export default function UploadGameResultForm({ data }) {
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

  const games = data;  // Assuming data is passed correctly

  const [formData, setFormData] = useState(initialFormState);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formGameResult');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formGameResult', JSON.stringify(formData));
    }
  }, [formData, isClient]);

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));

    if (changedValues.selectedGameId) {
      const game = games.find(game => game.key === changedValues.selectedGameId);
      setSelectedGame(game);
    }
  };

  const handleAddGoal = (team) => {
    const goal = { player: '', time: null };
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

  const handleTimeChange = (team, index, time, timeString) => {
    const newGoals = [...formData[team]];
    newGoals[index].time = timeString;
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
    if (isClient) {
      localStorage.removeItem('formGameResult');
    }
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס העלאת תוצאות למשחק</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={(changedValues, allValues) => handleChange(allValues)}
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
                showSearch
                placeholder="Select a game"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {games.map((game) => (
                  <Option key={game.key} value={game.key}>
                    {`משחק ${game.key}: ${moment(game.value[2]).format('YYYY-MM-DD')} - קבוצות: ${game.value[0]} מול ${game.value[1]}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {selectedGame && (
          <Row gutter={16}>
            <Col span={12}>
              <Title level={5}>{`קבוצה: ${selectedGame.value[0]}`}</Title>
              {formData.teamAGoals.map((goal, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Input
                        placeholder="שחקן"
                        value={goal.player}
                        onChange={(e) => handleGoalChange('teamAGoals', index, 'player', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <TimePicker
                        format="HH:mm"
                        value={goal.time ? moment(goal.time, "HH:mm") : null}
                        onChange={(time, timeString) => handleTimeChange('teamAGoals', index, time, timeString)}
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
              <Title level={5}>{`קבוצה: ${selectedGame.value[1]}`}</Title>
              {formData.teamBGoals.map((goal, index) => (
                <Row gutter={8} key={index}>
                  <Col span={16}>
                    <Form.Item>
                      <Input
                        placeholder="שחקן"
                        value={goal.player}
                        onChange={(e) => handleGoalChange('teamBGoals', index, 'player', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <TimePicker
                        format="HH:mm"
                        value={goal.time ? moment(goal.time, "HH:mm") : null}
                        onChange={(time, timeString) => handleTimeChange('teamBGoals', index, time, timeString)}
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
