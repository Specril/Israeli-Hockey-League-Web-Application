"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";
import { dataFetchLeagues } from './fetching';

const { Title } = Typography;
const { Option } = Select;

export default function FormComponent() {
  const initialFormState = {
    Age: '',
    League_Type: '',
  };

  const fieldLabels = {
    Age: 'גיל',
    League_Type: 'סוג ליגה',

  };

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [ageOptions, setAgeOptions] = useState([]);

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formAddLeague');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formAddLeague', JSON.stringify(formData));
    }
  }, [formData, isClient]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLeagues = await dataFetchLeagues();
      setAgeOptions(fetchedLeagues.map(obj => obj.Age));
    };
    fetchData();
  }, []);

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
    const final_data = {
      ...formData,

    };

    alert('Form Data JSON: ' + JSON.stringify(final_data));

    try {
      const response = await fetch('/api/form_manage_leagues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(final_data),
      });
    } catch (error) {
      console.error('Error updating data');
    }
    form.resetFields();
    setFormData(initialFormState);
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    if (isClient) {
      localStorage.removeItem('formAddLeague');
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
      <Title level={3}>טופס הוספת ליגה חדשה</Title>
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
              rules={[{ required: true, message: `${fieldLabels['Age']} is required` }]}
            >
              <Select
                value={formData['Age']}
                onChange={(value) => handleSelectChange(value, 'Age')}
              >
                {ageOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={fieldLabels['League_Type']}
              name="League_Type"
              rules={[{ required: true, message: `${fieldLabels['League_Type']} is required` }]}
            >
              <Select
                showSearch
                value={formData['League_Type']}
                onChange={(value) => handleSelectChange(value, 'League_Type')}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {LeagueTypeOptions.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
                <Option key="other" value="other">
                  אחר
                </Option>
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
