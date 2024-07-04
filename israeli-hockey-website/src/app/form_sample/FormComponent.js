"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import "../style.css"; // Ensure you have the correct path for your CSS

const { Title } = Typography;

const initialFormState = {
  fieldori: '',
  field2: '',
  field3ziv: '',
  field4: '',
  field5: '',
  field6: '',
  field7: '',
  field8: '',
  field9: '',
  field10: '',
};

export default function FormComponent() {
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedFormData = localStorage.getItem('formData');
      return savedFormData ? JSON.parse(savedFormData) : initialFormState;
    }
    return initialFormState;
  });

  const [form] = Form.useForm();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleSubmit = () => {
    alert('Form Data JSON:', JSON.stringify(formData));
    console.log('Form Data JSON:', JSON.stringify(formData));
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('formData');
    }
  };

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>Form Testing Zone</Title>
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
                label={`${field}`}
                name={field}
              >
                <Input
                  name={field}
                  value={formData[field]}
                />
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
