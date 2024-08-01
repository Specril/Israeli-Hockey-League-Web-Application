"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";
import { dataFetchLeague, dataFetchTeams } from './fetching';

const { Title } = Typography;
const { Option } = Select;

export default function FormComponent() {
  const initialFormState = {
    Age: '',
    Team_ID: '',
  };

  const fieldLabels = {
    Age: 'ליגה-גיל',
    Team_ID: 'קבוצה',
  };



  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [Team_IDOptions, setTeamsOptions] =  useState([]);
  const [Age_options, setAge_options] =  useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const fetchedLeagues = await dataFetchLeague();
      const fetchedTeams = await dataFetchTeams();
      const teamOptions = fetchedTeams.map(team => ({
        key: team.Team_ID,
        value: {
          Age: team.Age,
          Team_Name: team.Team_Name,
        }
      }));
      setAge_options(fetchedLeagues);
      setTeamsOptions(teamOptions);
    };
    fetchData();
  }, []); 

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formDeleteTeam');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formDeleteTeam', JSON.stringify(formData));
    }
  }, [formData, isClient]);

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleSelectChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const final_data = { ...formData };
    alert('Form Data JSON: ' + JSON.stringify(final_data));

    try {
      const response = await fetch('/api/form_manage_team', {
        method: 'DELETE',
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
      localStorage.removeItem('formDeleteTeam');
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
      });
    }
  }, [formData, form, isClient]);

  const filteredTeams = formData.Age
    ? Team_IDOptions.filter(option => option.value.Age === formData.Age)
    : Team_IDOptions;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס מחיקת קבוצת גיל</Title>
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
              label={fieldLabels['Age']}
              name="Age"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['Age']} is required`,
                },
              ]}
            >
              <Select
                value={formData['Age']}
                onChange={(value) => handleSelectChange(value, 'Age')}
              >
                {Age_options.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

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
                {filteredTeams.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.value.Team_Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
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
