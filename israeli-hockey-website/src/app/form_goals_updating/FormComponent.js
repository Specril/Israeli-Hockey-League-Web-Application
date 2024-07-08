"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, DatePicker, Select } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import "../style.css"; // Ensure you have the correct path for your CSS
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const initialFormState = {
  game_ID: '',
  field1: '',
  field2: '',
  field3: '',
  league_field: '',
  field6: '',
  field7: '',
  field4: '',

  field8: '',
  field9: '',
  // field10: '',
};

const fieldLabels = {
  game_ID: 'מזהה משחק',
  field1: 'תאריך',
  field2: 'יום',
  field3: 'שעה',
  league_field: 'ליגה',
  field6: 'מיקום',
  field7: 'שופט',
  field4: 'קבוצה',
  field8: 'שם מלא',
  field9: 'מספר חולצה',
  // field10: 'Field Ten',
};

const field4Options = ['אריות', 'קריית ביאליק', 'קריית ים','רמת ישי','חלוצים','סנדוויץ','הרקולס','קרנפים']; // Replace with actual options
const field5Options = ['אריות', 'קריית ביאליק', 'קריית ים','רמת ישי','חלוצים','סנדוויץ','הרקולס','קרנפים']; // Replace with actual options

export default function FormComponent() {
  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formDataGoals');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formDataGoals', JSON.stringify(formData));
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
      field1: dateString,
    }));
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
    if (isClient) {
      localStorage.removeItem('formDataGoals');
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
        field1: formData.field1 ? moment(formData.field1) : null, // Set date value using moment
      });
    }
  }, [formData, form, isClient]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס העלאת פרטי גול</Title>
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
                    required: field === 'game_ID' || field === 'field1' || field == 'league_field' || field == 'field4' || field == "field8", // Set required fields
                    message: `${fieldLabels[field]} is required`,
                  },
                ]}
              >
                {field === 'field1' ? (
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={formData[field] ? moment(formData[field]) : null}
                    onChange={handleDateChange}
                  />
                ) : field === 'field4' ? (
                  <Select
                    value={formData[field]}
                    onChange={(value) => handleSelectChange(value, field)}
                  >
                    {field4Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                ) : field === 'field5' ? (
                  <Select
                    value={formData[field]}
                    onChange={(value) => handleSelectChange(value, field)}
                  >
                    {field5Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
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
