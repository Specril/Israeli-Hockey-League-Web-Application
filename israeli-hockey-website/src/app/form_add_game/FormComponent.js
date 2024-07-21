"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, DatePicker, Select, TimePicker } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import "../style.css"; // Ensure you have the correct path for your CSS
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const initialFormState = {
  field1: '',
  field2: '',
  field3: '',
  field_league: '',
  field4: '',
  field5: '',
  field6: '',
  field7: '',
  field8: '',
  // field9: '',
  // field10: '',
};

const fieldLabels = {
  field1: 'תאריך',
  field2: 'יום',
  field3: 'שעה',
  field_league: 'ליגה',
  field4: 'קבוצת בית',
  field5: 'קבוצת חוץ',
  field6: 'מיקום',
  field7: 'שופט 1',
  field8: 'שופט 2',
  // field9: 'Field Nine',
  // field10: 'Field Ten',
};

const field2Options = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const field4Options = ['אריות', 'קריית ביאליק', 'קריית ים', 'רמת ישי', 'חלוצים', 'סנדוויץ', 'הרקולס', 'קרנפים'];
const field5Options = ['אריות', 'קריית ביאליק', 'קריית ים', 'רמת ישי', 'חלוצים', 'סנדוויץ', 'הרקולס', 'קרנפים'];
const field6Options = ['מגרש 1', 'מגרש 2', 'מגרש 3', 'מגרש 4'];
const field_league_options = ['צעירים', 'בוגרים'];
const field7Options = ['שופט א', 'שופט ב', 'שופט ג'];
const field8Options = ['שופט א', 'שופט ב', 'שופט ג'];

export default function Page1() {
  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formDataGames');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formDataGames', JSON.stringify(formData));
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

  const handleTimeChange = (time, timeString) => {
    setFormData((prevData) => ({
      ...prevData,
      field3: timeString,
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
    // form.resetFields();
  };

  const handleClearAll = () => {
    // form.resetFields();
    setFormData(initialFormState);
    if (isClient) {
      localStorage.removeItem('formDataGames');
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
        field1: formData.field1 ? moment(formData.field1) : null, // Set date value using moment
        field3: formData.field3 ? moment(formData.field3, 'HH:mm') : null, // Set time value using moment
      });
    }
  }, [formData, form, isClient]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס העלאת פרטי משחק</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          {Object.keys(formData).map((field, index) => (
            <Col span={24} key={index}>
              <Form.Item
                label={fieldLabels[field]}
                name={field}
                rules={[
                  {
                    required: field === 'field1' || field === 'field2' || field === 'field3' || field === 'field4' || field === 'field5' || field === 'field6' || field == 'field_league', // Set required fields
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
                ) : field === 'field3' ? (
                  <TimePicker
                    format="HH:mm"
                    value={formData[field] ? moment(formData[field], 'HH:mm') : null}
                    onChange={handleTimeChange}
                  />
                ) : (
                  <Select
                    showSearch
                    value={formData[field]}
                    onChange={(value) => handleSelectChange(value, field)}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {field === 'field2' ? field2Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'field4' ? field4Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'field5' ? field5Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'field6' ? field6Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'field_league' ? field_league_options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'field7' ? field7Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'field8' ? field8Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : null}
                  </Select>
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
