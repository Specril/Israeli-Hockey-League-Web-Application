"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";

const { Title } = Typography;
const { Option } = Select;


export default function FormComponent({data}) {


  const initialFormState = {
    Team_Name: '',
    League_ID: '',
    Location: '',
    Rank: null,
  };
  
  const fieldLabels = {
    Team_Name: 'שם קבוצה',
    League_ID: 'ליגה',
    Location: 'מיקום',
    Rank: 'דירוג',
  };
  

    // const League_IDOptions = data[0]
    const LocationsOptions = data[1]
    console.log("inside form component")
    console.log(LocationsOptions)



  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formAddTeam');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formAddTeam', JSON.stringify(formData));
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


  // This version of handleSubmit is good for debugging frontend without connecting to the db

  // const handleSubmit = () => {
  //   alert('Form Data JSON: ' + JSON.stringify(formData));
  //   console.log('Form Data JSON:', JSON.stringify(formData));
  // };

  const handleSubmit = async () => {

    const final_data = {...formData}

    alert('Form Data JSON: ' + JSON.stringify(final_data));

    try {
      const response = await fetch('/api/form_add_team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(final_data),
      })
    } catch (error) {
      console.alert('Error updating data');
    }
    
  };



  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    if (isClient) {
      localStorage.removeItem('formAddTeam');
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
        Date_of_Birth: formData.Date_of_Birth ? moment(formData.Date_of_Birth) : null, // Set date value using moment
      });
    }
  }, [formData, form, isClient]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס הוספת קבוצה</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={fieldLabels['Team_Name']}
              name="Team_Name"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['Team_Name']} is required`,
                },
              ]}
            >
              <Input
                name="Team_Name"
                value={formData['Team_Name']}
                onChange={(e) => handleChange({ Team_Name: e.target.value })}
              />
            </Form.Item>
          </Col>

          {/* <Col span={12}>   
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
    >
      {League_IDOptions.map((option) => (
        <Option key={option.key} value={option.key}>
          {option.value}
        </Option>
      ))}
    </Select>
            </Form.Item>
            </Col>  */}
          
          <Col span={12}>
            <Form.Item
              label={fieldLabels['Location']}
              name="Location"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['Location']} is required`,
                },
              ]}
            >
              <Select
                showSearch
                value={formData['Location']}
                onChange={(value) => handleSelectChange(value, 'Location')}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {LocationsOptions.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
          <Form.Item
              label={fieldLabels['Rank']}
              name="Rank"
              rules={[
                {
                  type: 'number',
                  message: `${fieldLabels['Rank']} must be a number`,
                },
                {
                  validator: (_, value) => {
                    if (value === null || (Number.isInteger(value) && value >= 0)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(`${fieldLabels['Rank']} must be a non-negative integer`);
                  },
                },]}
            >
              <InputNumber
          style={{ width: '100%' }}
          min={0}
          precision={0}
          value={formData['Rank']}
          onChange={(value) => handleChange({ ['Rank']: value })}
        />
            </Form.Item>
          </Col>

          <Col span={12}>
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






