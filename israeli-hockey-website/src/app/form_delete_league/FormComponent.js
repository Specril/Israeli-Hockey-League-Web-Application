"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";
import { dataFetchLeague, dataFetchTeams } from './fetching';


const { Title } = Typography;
const { Option } = Select;

export default function FormComponent({ data }) {
  const initialFormState = {
    League_ID: '',
  };

  const fieldLabels = {
    League_ID: 'ליגה',
  };



  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [League_ID_options, setLeagueOptions] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      const fetchedLeagues = await dataFetchLeague();
      setLeagueOptions(fetchedLeagues);
    };
    fetchData();
  }, []);


  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formDeleteLeague');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formDeleteLeague', JSON.stringify(formData));
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
      ...formData,
    };

    alert('Form Data JSON: ' + JSON.stringify(final_data));

    try {
      await fetch('/api/form_manage_leagues', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(final_data),
      });
    } catch (error) {
      console.error('Error updating data');
    }
        // for resetting the fields once sent
    form.resetFields();
    setFormData(initialFormState);

  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);

    if (isClient) {
      localStorage.removeItem('formDeleteLeague');
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
      <Title level={3}>טופס מחיקת ליגה</Title>
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
