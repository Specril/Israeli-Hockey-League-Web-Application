"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, DatePicker } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import "../style.css";
import dayjs from 'dayjs';

const { Title } = Typography;

export default function FormComponent({ data }) {
  const initialFormState = {
    Date_of_Birth: null, // Changed this to null initially
    Full_Name: '',
    Phone: '',
    Email: '',
    Residence: ''
  };

  const fieldLabels = {
    Date_of_Birth: 'תאריך לידה',
    Full_Name: 'שם מלא',
    Phone: 'טלפון',
    Email: 'מייל',
    Residence: 'כתובת'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formDataPersonal');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    } else {
      // Initial load from props
      if (data && data.length > 0) {
        setFormData({
          Date_of_Birth: data[0].Date_of_Birth ? dayjs(data[0].Date_of_Birth).format('YYYY-MM-DD') : null,
          Full_Name: data[0].Full_Name || '',
          Phone: data[0].Phone || '',
          Email: data[0].Email || '',
        });
      }
    }
  }, [data]);

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
    console.log("handleDateChange - date: ", date);
    console.log("handleDateChange - dateString: ", dateString);

    setFormData((prevData) => ({
      ...prevData,
      Date_of_Birth: date ? dateString : null,
    }));
  };

  // const handleSubmit = () => {
  //   alert('Form Data JSON: ' + JSON.stringify(formData));
  //   console.log('Form Data JSON:', JSON.stringify(formData));
  //   setFormData(initialFormState);
  // };

   const handleSubmit = async () => {
    // setFormData({...formData, User_ID: data[0]['User_ID']})
    const final_data = {...formData, User_ID: data[0]['User_ID']}

    alert('Form Data JSON: ' + JSON.stringify(final_data));
    // onFinish(formData);
    try {
      const response = await fetch('/api/form_personal_details', {
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
    // form.resetFields();
    setFormData(initialFormState);
    if (isClient) {
      localStorage.removeItem('formDataPersonal');
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
        Date_of_Birth: formData.Date_of_Birth ? dayjs(formData.Date_of_Birth, 'YYYY-MM-DD') : null,
      });
    }
  }, [formData, form, isClient]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>טופס פרטים אישיים </Title>
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

          <Col span={12}>
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

          <Col span={12}>
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

          <Col span={12}>
            <Form.Item
              label={fieldLabels['Residence']}
              name="Residence"
             
            >
              <Input
                name="Residence"
                value={formData['Residence']}
                onChange={(e) => handleChange({ Residence: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
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
                value={formData['Date_of_Birth'] ? dayjs(formData['Date_of_Birth'], 'YYYY-MM-DD') : null}
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
