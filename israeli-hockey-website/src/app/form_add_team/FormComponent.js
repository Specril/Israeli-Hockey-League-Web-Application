"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import "../style.css";
import { dataFetchLeagues, dataFetchLocations } from './fetching';

const { Title } = Typography;
const { Option } = Select;

export default function FormComponent() {
  const initialFormState = {
    Team_Name: '',
    Age: '',
    Location_ID: '',
    New_Location: '', // For new location name
    Photo: '', // For base64 image string
  };

  const fieldLabels = {
    Team_Name: 'שם קבוצה',
    Age: 'גיל',
    Location_ID: 'מיקום',
    New_Location: 'מיקום חדש', // Label for new location
    Photo: 'לוגו קבוצה', // Label for the image
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [isOtherLocation, setIsOtherLocation] = useState(false);
  const [ageOptions, setAgeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [base64String, setBase64String] = useState('');

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

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLeagues = await dataFetchLeagues();
      const fetchedLocations = await dataFetchLocations();
      setAgeOptions(fetchedLeagues.map(obj => obj.Age));
      setLocationOptions(fetchedLocations);
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
    if (value === "other") {
      setIsOtherLocation(true);
    } else {
      setIsOtherLocation(false);
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
        New_Location: '',
      }));
    }
  };

  const handleFileChange = ({ file }) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64String(reader.result);
      handleChange({ Photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const final_data = {
      ...formData,
      Location_ID: isOtherLocation ? formData.New_Location : formData.Location_ID,
    };

    alert('Form Data JSON: ' + JSON.stringify(final_data));
    console.log('Form Data JSON: ' + JSON.stringify(final_data));

    try {
      const response = await fetch('/api/form_manage_team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(final_data),
      });
      const result = await response.json();
      if (result.success) {
        message.success('הטופס נשלח בהצלחה!');
      } else {
        message.error('שגיאה בשליחת הטופס.');
      }
    } catch (error) {
      console.error('Error updating data', error);
      message.error('שגיאה בשליחת הטופס.');
    }
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    setIsOtherLocation(false);
    setBase64String('');
    if (isClient) {
      localStorage.removeItem('formAddTeam');
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
      <Title level={3}>טופס הוספת קבוצה חדשה</Title>
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
              label={fieldLabels['Team_Name']}
              name="Team_Name"
              rules={[{ required: true, message: `${fieldLabels['Team_Name']} is required` }]}
            >
              <Input
                name="Team_Name"
                value={formData['Team_Name']}
                onChange={(e) => handleChange({ Team_Name: e.target.value })}
              />
            </Form.Item>
          </Col>

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
              label={fieldLabels['Location_ID']}
              name="Location_ID"
              rules={[{ required: true, message: `${fieldLabels['Location_ID']} is required` }]}
            >
              <Select
                showSearch
                value={formData['Location_ID']}
                onChange={(value) => handleSelectChange(value, 'Location_ID')}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {locationOptions.map((option) => (
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

          {isOtherLocation && (
            <Col span={24}>
              <Form.Item
                label={fieldLabels['New_Location']}
                name="New_Location"
                rules={[{ required: true, message: `${fieldLabels['New_Location']} is required` }]}
              >
                <Input
                  name="New_Location"
                  value={formData['New_Location']}
                  onChange={(e) => handleChange({ New_Location: e.target.value })}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              label={fieldLabels['Photo']}
              name="Photo"
              rules={[{ required: false }]}
            >
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleFileChange({ file });
                  return false; // Prevent automatic upload
                }}
              >
                <Button icon={<UploadOutlined />}>בחר לוגו</Button>
              </Upload>
              {base64String && (
                <div style={{ marginTop: '20px' }}>
                  <Typography.Text>לוגו שנבחר:</Typography.Text>
                  <img src={base64String} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />
                </div>
              )}
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
