"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";
import { dataFetchLeague, dataFetchTeams, } from './fetching';


const { Title } = Typography;
const { Option } = Select;

export default function FormComponent({ data }) {
  const initialFormState = {
    Team_ID: '',
    League_ID: '',

  };

  const fieldLabels = {
    Team_ID: 'שם קבוצה',
    League_ID: 'ליגה',
  };

  // const teamsOptions = data[0];
  // const League_ID_options = data[1];


  console.log("inside form component");


  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [League_ID_options, setLeagueOptions] = useState([]);
  const [teamsOptions, setTeamsOptions] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const fetchedLeagues = await dataFetchLeague();
      const fetchedTeams = await dataFetchTeams();
      setLeagueOptions(fetchedLeagues);
      setTeamsOptions(fetchedTeams);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formAddTeamToLeague');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formAddTeamToLeague', JSON.stringify(formData));
    }
  }, [formData, isClient]);

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleDateChange = (date, dateString) => {
    setFormData((prevData) => ({
      ...prevData,
      Date_of_Birth: date ? dateString : null,
    }));
  };

  const handleSelectChange = (value, field) => {

    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

  };

  const handleSubmit = async () => {
    const final_data = {
      ...formData
    };

    alert('Form Data JSON: ' + JSON.stringify(final_data));

    try {
      const response = await fetch('/api/manage_teams_in_leagues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(final_data),
      });
    } catch (error) {
      console.alert('Error updating data');
    }
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    if (isClient) {
      localStorage.removeItem('formAddTeamToLeague');
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
      });
    }
  }, [formData, form, isClient]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס הוספת קבוצה לליגה</Title>
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
              label={fieldLabels['Team_ID']}
              name="Team_ID"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['Team_ID']} is required`,
                },
              ]}
            >
              <Select
                value={formData['Team_ID']}
                onChange={(value) => handleSelectChange(value, 'Team_ID')}
              >
                {teamsOptions.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={fieldLabels['League_ID']}
              name="League_ID"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['League_ID']} is required`,
                },
              ]}
            >
              <Select
                value={formData['League_ID']}
                onChange={(value) => handleSelectChange(value, 'League_ID')}
                style={{ width: '100%' }}
              >
                {League_ID_options.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>


          <Col span={24}></Col>
        </Row>
        <Row gutter={16}>
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
