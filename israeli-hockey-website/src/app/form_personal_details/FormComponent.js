"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, DatePicker } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import "../style.css"; // Ensure you have the correct path for your CSS
import moment from 'moment';

const { Title } = Typography;

export default function FormComponent({ data }) {
  const initialFormState = {
    Full_Name: data[0]["Full_Name"],  // a default should be taken from a JSON file based on the user's current data
    Phone: '',
    Email: '',
    Date_of_Birth: '',
    // field5: '',
    // field6: '',
    // field7: '',
    // field8: '',
    // field9: '',
    // field10: '',
  };

  const fieldLabels = {
    Full_Name: 'שם מלא',
    Phone: 'טלפון',
    Email: 'כתובת אימייל',
    Date_of_Birth: 'תאריך לידה',
    // field5: 'Field Five',
    // field6: 'Field Six',
    // field7: 'Field Seven',
    // field8: 'Field Eight',
    // field9: 'Field Nine',
    // field10: 'Field Ten',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formDataPersonalDetails');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formDataPersonalDetails', JSON.stringify(formData));
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
      Date_of_Birth: dateString,
    }));
  };

  const handleSubmit = () => {
    onFinish(formData);
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    if (isClient) {
      localStorage.removeItem('formDataPersonalDetails');
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      ...formData,
      Date_of_Birth: formData.Date_of_Birth ? moment(formData.Date_of_Birth) : null, // Set date value using moment
    });
  }, [formData, form]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס לעדכון פרטים אישיים</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          {Object.keys(formData).map((field, index) => (
            <Col span={12} key={index}>
              <Form.Item
                label={fieldLabels[field]}
                name={field}
                rules={[
                  {
                    required: field === 'Full_Name' || field === 'Phone' || field === 'Email', // Set required fields
                    message: `${fieldLabels[field]} is required`,
                  },
                  (field === 'Full_Name' || field === 'Email') ? {
                    type: 'string',
                    max: 255,
                    message: `${fieldLabels[field]} must be a string of max length 255`,
                  } : {},
                ]}
              >
                {field === 'Date_of_Birth' ? (
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={formData[field] ? moment(formData[field]) : null}
                    onChange={handleDateChange}
                  />
                ) : (
                  <Input
                    name={field}
                    value={formData[field]}
                  />
                )}
              </Form.Item>
            </Col>
          ))}
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
