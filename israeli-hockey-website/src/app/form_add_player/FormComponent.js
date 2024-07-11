"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";

const { Title } = Typography;
const { Option } = Select;

const initialFormState = {
  field1: '',
  field2: '',
  field3: '',
  field4: null,
};

const fieldLabels = {
  field1: 'שם מלא',
  field2: 'קבוצה',
  field3: 'תפקיד',
  field4: 'מספר חולצה',
};

const field2Options = ['Team A', 'Team B', 'Team C'];

export default function FormComponent() {
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedFormData = localStorage.getItem('formDataPlayer');
      return savedFormData ? JSON.parse(savedFormData) : initialFormState;
    }
    return initialFormState;
  });

  const [form] = Form.useForm();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formDataPlayer', JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (changedValues) => {
    const updatedValues = { ...formData, ...changedValues };
    // Convert empty string to null for field4
    if (changedValues.field4 === '') {
      updatedValues.field4 = null;
    }
    setFormData(updatedValues);
    form.setFieldsValue(updatedValues);
  };

  const handleSelectChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    alert('Form Data JSON: ' + JSON.stringify(formData));
    console.log('Form Data JSON:', JSON.stringify(formData));
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('formDataPlayer');
    }
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  useEffect(() => {
    const formValues = { ...formData };
    if (formValues.field4 === null) {
      formValues.field4 = undefined; // Ant Design prefers undefined for empty number inputs
    }
    form.setFieldsValue(formValues);
  }, [formData, form]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס הוספת שחקן לקבוצה</Title>
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
          required: field === 'field1' || field === 'field2' || field === 'field4',
          message: `${fieldLabels[field]} is required`,
        },
        field === 'field1' || field === 'field3' ? {
          type: 'string',
          max: 255,
          message: `${fieldLabels[field]} must be a string of max length 255`,
        } : {},
        field === 'field4' ? [
          {
            type: 'number',
            message: `${fieldLabels[field]} must be a number`,
          },
          {
            validator: (_, value) => {
              if (value === null || (Number.isInteger(value) && value >= 0)) {
                return Promise.resolve();
              }
              return Promise.reject(`${fieldLabels[field]} must be a non-negative integer`);
            },
          },
        ] : {},
      ]}
    >
      {field === 'field2' ? (
        <Select
          value={formData[field]}
          onChange={(value) => handleSelectChange(value, field)}
        >
          {field2Options.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      ) : field === 'field4' ? (
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          precision={0}
          value={formData[field]}
          onChange={(value) => handleChange({ [field]: value })}
        />
      ) : (
        <Input
          name={field}
          value={formData[field]}
          onChange={(e) => handleChange({ [field]: e.target.value })}
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