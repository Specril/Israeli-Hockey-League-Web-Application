"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";

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

  // const teamsOptions = data[0].map(team => ({
  //   key: `${team.Team_ID}-${team.League_ID}`,
  //   value: {
  //     League_ID: team.League_ID,
  //     Team_Name: team.Team_Name,
  //     Age: team.Age,
  //     League_Type: team.League_Type
  //   }
  // }));
  // console.log(teamsOptions)
  const teamsOptions = data[0];

  const League_ID_options = data[1];

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formDeleteTeamFromLeague');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formDeleteTeamFromLeague', JSON.stringify(formData));
    }
  }, [formData, isClient]);

  const handleChange = (changedValues) => {
    console.log('inside handle change')
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleSelectChange = (value, field) => {
    console.log('inside handle select change')
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
      await fetch('/api/form_delete_team_from_league', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(final_data),
      });
    } catch (error) {
      console.error('Error updating data');
    }
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    if (isClient) {
      localStorage.removeItem('formDeleteTeamFromLeague');
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
      });
    }
  }, [formData, form, isClient]);

  const filteredTeams = formData.League_ID
    ? teamsOptions.filter(option => option.value.League_ID === formData.League_ID)
    : teamsOptions;  


  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס מחיקת קבוצה מליגה</Title>
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
                style={{ width: '100%' }}
              >
                {filteredTeams.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {`${option.value.Team_Name} - ${option.value.Age} - ${option.value.League_Type}`}
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
