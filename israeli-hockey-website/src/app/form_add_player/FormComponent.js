"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";

const { Title } = Typography;
const { Option } = Select;


export default function FormComponent({data}) {


  const initialFormState = {
    Full_Name: '',
    Team_ID: '',
    Position: '',
    Shirt_Number: null,
  };
  
  const fieldLabels = {
    Full_Name: 'שם מלא',
    Team_ID: 'קבוצה',
    Position: 'תפקיד',
    Shirt_Number: 'מספר חולצה',
  };
  
  // const field2Options = ['Team A', 'Team B', 'Team C']; 
    const Team_IDOptions = data



  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formPlayer');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formPlayer', JSON.stringify(formData));
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
      const response = await fetch('/api/form_add_player', {
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
      localStorage.removeItem('formPlayer');
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
      <Title level={3}>טופס הוספת שחקן</Title>
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
              label={fieldLabels['Team_ID']}
              name="Team_ID"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['Team_ID']} is required`,
                },
              ]}
            >
             <Select
      value={formData['Team_ID']}
      onChange={(value) => handleSelectChange(value, 'Team_ID')}
    >
      {Team_IDOptions.map((option) => (
        <Option key={option.key} value={option.key}>
          {option.value}
        </Option>
      ))}
    </Select>
            </Form.Item>
            </Col> 
          
          <Col span={12}>
            <Form.Item
              label={fieldLabels['Position']}
              name="Position"
            >
              <Input
                name="Position"
                value={formData['Position']}
                onChange={(e) => handleChange({ Phone: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
          <Form.Item
              label={fieldLabels['Shirt_Number']}
              name="Shirt_Number"
              rules={[
                {
                  type: 'number',
                  message: `${fieldLabels['Shirt_Number']} must be a number`,
                },
                {
                  validator: (_, value) => {
                    if (value === null || (Number.isInteger(value) && value >= 0)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(`${fieldLabels['Shirt_Number']} must be a non-negative integer`);
                  },
                },]}
            >
              <InputNumber
          style={{ width: '100%' }}
          min={0}
          precision={0}
          value={formData['Shirt_Number']}
          onChange={(value) => handleChange({ ['Shirt_Number']: value })}
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






    {/* <Form.Item
      label={fieldLabels[field]}
      name={field}
      rules={[
        {
          required: field === 'Full_Name' || field === 'field2' || field === 'Shirt_Number',
          message: `${fieldLabels[field]} is required`,
        },
        field === 'Full_Name' || field === 'Position' ? {
          type: 'string',
          max: 255,
          message: `${fieldLabels[field]} must be a string of max length 255`,
        } : {},
        field === 'Shirt_Number' ? [
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
      ) : field === 'Shirt_Number' ? (
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
    </Form.Item> */}
  {/* </Col>
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
} */}