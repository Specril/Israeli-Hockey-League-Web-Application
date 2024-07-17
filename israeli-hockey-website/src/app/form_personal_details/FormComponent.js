"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, DatePicker, Select, TimePicker } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import "../style.css"; // Ensure you have the correct path for your CSS
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;


export default function FormComponent({ data }) {
const initialFormState = {
  Date_of_Birth: '', 
  Full_Name: data[0]['Full_Name'],
  Phone: '',
  Email: '',

};

const fieldLabels = {
  Date_of_Birth: 'תאריך',
  Full_Name: 'שם מלא',
  Phone: 'טלפון',
  Email: 'מייל',

};



  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formDataPersonal');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formDataPersonal', JSON.stringify(formData));
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

  const handleSubmit = () => {
    alert('Form Data JSON: ' + JSON.stringify(formData));
    console.log('Form Data JSON:', JSON.stringify(formData));
  };


  // const handleSubmit = async () => {
  //   // setFormData({...formData, User_ID: data[0]['User_ID']})
  //   const final_data = {...formData, User_ID: data[0]['User_ID']}

  //   alert('Form Data JSON: ' + JSON.stringify(final_data));
  //   // onFinish(formData);
  //   try {
  //     const response = await fetch('/api/form_personal_details', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(final_data),
  //     })
  //   } catch (error) {
  //     console.alert('Error updating data');
  //   }
    
  // };



  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    if (isClient) {
      localStorage.removeItem('formDataPersonal');
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
      <Title level={3}>טופסססס פרטים אישיים בדיקה</Title>
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
              label={fieldLabels['Full_Name']}
              name="Full_Name"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['Full_Name']} is required`,
                },
              ]}
            >
              <Input
                name="Full_Name"
                value={formData['Full_Name']}
                onChange={(e) => handleChange({ Full_Name: e.target.value })}
              />
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              label={fieldLabels['Phone']}
              name="Phone"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['Phone']} is required`,
                },
              ]}
            >
              <Input
                name="Phone"
                value={formData['Phone']}
                onChange={(e) => handleChange({ Phone: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={fieldLabels['Email']}
              name="Email"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['Email']} is required`,
                },
              ]}
            >
              <Input
                name="Email"
                value={formData['Email']}
                onChange={(e) => handleChange({ Email: e.target.value })}
              />
            </Form.Item>
          </Col>
              
          <Col span={24}>
            <Form.Item
              label={fieldLabels['Date_of_Birth']}
              name="Date_of_Birth"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['Date_of_Birth']} is required`,
                },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                value={formData['Date_of_Birth'] ? moment(formData['Date_of_Birth']) : null}
                onChange={handleDateChange}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
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
