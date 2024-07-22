"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, DatePicker, Select, TimePicker } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import "../style.css"; // Ensure you have the correct path for your CSS
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;



export default function AddGameForm({ data }) {


  const initialFormState = {
    Date: '',
    Day: '',
    Start_Time: '',
    League_ID: '',
    Home_Team_ID: '',
    Away_Team_ID: '',
    Location_ID: '',
    Referee_ID: '',
    Second_Referee_ID: '',

  };
  
  const fieldLabels = {
    Date: 'תאריך',
    Day: 'יום',
    Start_Time: 'שעה',
    League_ID: 'ליגה',
    Home_Team_ID: 'קבוצת בית',
    Away_Team_ID: 'קבוצת חוץ',
    Location_ID: 'מיקום',
    Referee_ID: 'שופט 1',
    Second_Referee_ID: 'שופט 2',

  };
  
  const DayOptions = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const Home_Team_IDOptions = ['אריות', 'קריית ביאליק', 'קריית ים', 'רמת ישי', 'חלוצים', 'סנדוויץ', 'הרקולס', 'קרנפים'];
  const Away_Team_IDOptions = ['אריות', 'קריית ביאליק', 'קריית ים', 'רמת ישי', 'חלוצים', 'סנדוויץ', 'הרקולס', 'קרנפים'];
  const field6Options = ['מגרש 1', 'מגרש 2', 'מגרש 3', 'מגרש 4'];
  const League_ID_options = data[1];
  const Referee_IDOptions = ['שופט א', 'שופט ב', 'שופט ג'];
  const field8Options = ['שופט א', 'שופט ב', 'שופט ג'];

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
      Date: dateString,
    }));
  };

  const handleTimeChange = (time, timeString) => {
    setFormData((prevData) => ({
      ...prevData,
      Start_Time: timeString,
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
        Date: formData.Date ? moment(formData.Date) : null, // Set date value using moment
        Start_Time: formData.Start_Time ? moment(formData.Start_Time, 'HH:mm') : null, // Set time value using moment
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
                    required: field === 'Date' || field === 'Day' || field === 'Start_Time' || field === 'Home_Team_ID' || field === 'Away_Team_ID' || field === 'Location_ID' || field == 'League_ID', // Set required fields
                    message: `${fieldLabels[field]} is required`,
                  },
                ]}
              >
                {field === 'Date' ? (
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={formData[field] ? moment(formData[field]) : null}
                    onChange={handleDateChange}
                  />
                ) : field === 'Start_Time' ? (
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
                    {field === 'Day' ? DayOptions.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'Home_Team_ID' ? Home_Team_IDOptions.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'Away_Team_ID' ? Away_Team_IDOptions.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'Location_ID' ? field6Options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'League_ID' ? League_ID_options.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'Referee_ID' ? Referee_IDOptions.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    )) : field === 'Second_Referee_ID' ? field8Options.map((option) => (
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
