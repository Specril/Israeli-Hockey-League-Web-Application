"use client";
import React, { useState, useEffect } from 'react';
import { Form, Button, Typography, Row, Col, Select, Checkbox, Descriptions, Input } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function FormComponent({ data }) {
  const initialFormState = {
    User_ID: '',
    Clasification: [], // Ensure Clasification is always an array
    CustomRole: '' // Add custom role to form state
  };

  const fieldLabels = {
    User_ID: 'שם מלא',
    Clasification: 'סיווג המשתמש',
    CustomRole: 'מאמן- תפקיד' // Label for custom role
  };

  const usersOptions = data[0]; // User options
  const clasificationOptions = [
    { key: 'Users_Admin', value: 'אדמין' },
    { key: 'Users-Referees', value: 'שופט' },
    { key: 'Users-Players', value: 'שחקן' },
    { key: 'Users-Fans', value: 'אוהד' },
    { key: 'Users-Coaches', value: 'מאמן' }
  ]; // Predefined roles

  const roleKeys = {
    'Users_Admin': 'admin',
    'Users-Referees': 'referee',
    'Users-Players': 'player',
    'Users-Fans': 'fan',
    'Users-Coaches': 'coach'
  };

  // Additional state to hold selected user details and custom role
  const [selectedUser, setSelectedUser] = useState(null);
  const [customRole, setCustomRole] = useState('');

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData, isClient]);

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleSelectChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    // Find and set the selected user details
    const user = usersOptions.find(user => user.key === value);
    setSelectedUser(user || null);
  };

  const handleCheckboxChange = (checkedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      Clasification: checkedValues,
    }));
    
    // Check if 'Users-Coaches' is selected and manage custom role input visibility
    if (checkedValues.includes('Users-Coaches')) {
      setCustomRole(formData.CustomRole); // Preserve custom role
    } else {
      setCustomRole(''); // Clear custom role if not selected
    }
  };

  const handleCustomRoleChange = (e) => {
    setCustomRole(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      CustomRole: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    // Prepare role data
    const roleData = clasificationOptions.reduce((acc, role) => {
      acc[roleKeys[role.key]] = formData.Clasification.includes(role.key) ? 1 : 0;
      return acc;
    }, {});
  
    // Prepare final data to be sent
    const finalData = {
      User_ID: formData.User_ID,
      ...roleData,
      CustomRole: formData.Clasification.includes('Users-Coaches') ? formData.CustomRole : ''
    };
  
    try {
      const response = await fetch('/api/manage_users_types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData), // Ensure CustomRole is sent as a string
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      alert('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error updating data');
    }
  };
  
  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    setSelectedUser(null); // Clear selected user details
    setCustomRole(''); // Clear custom role
    if (isClient) {
      localStorage.removeItem('formData');
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
        CustomRole: customRole // Sync custom role with form
      });
    }
  }, [formData, form, customRole, isClient]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}> סיווג המשתמשים ונתינת הרשאות</Title>
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
              label={fieldLabels['User_ID']}
              name="User_ID"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels['User_ID']} is required`,
                },
              ]}
            >
              <Select
                showSearch
                value={formData['User_ID']}
                onChange={(value) => handleSelectChange(value, 'User_ID')}
                filterOption={(input, option) =>
                  option.props.children
                    ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : false
                }
              >
                {usersOptions.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={fieldLabels['Clasification']}
              name="Clasification"
            >
              <Checkbox.Group
                value={formData['Clasification']}
                onChange={handleCheckboxChange}
              >
                <Row>
                  {clasificationOptions.map(role => (
                    <Col span={8} key={role.key}>
                      <Checkbox value={role.key}>{role.value}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Display custom role input if 'Users-Coaches' is selected */}
        {(formData.Clasification || []).includes('Users-Coaches') && (
          <Form.Item
            label={fieldLabels['CustomRole']}
            name="CustomRole"
          >
            <TextArea
              value={customRole}
              onChange={handleCustomRoleChange}
              placeholder="הכנס את תפקיד המאמן"
              rows={4}
            />
          </Form.Item>
        )}

        {/* Display selected user details */}
        {selectedUser && (
          <Row gutter={16}>
            <Col span={24}>
              <Title level={4}>פרטי המשתמש הנבחר</Title>
              <Descriptions bordered>
                <Descriptions.Item label="שם מלא" span={3}>
                  {selectedUser.value}
                </Descriptions.Item>
                <Descriptions.Item label="סיווג המשתמש (ניתן לבחור כמה אפשרויות)" span={3}>
                  {formData.Clasification.map(roleKey => {
                    const role = clasificationOptions.find(r => r.key === roleKey);
                    return role ? role.value : null;
                  }).join(', ')}
                </Descriptions.Item>
                {(formData.Clasification || []).includes('Users-Coaches') && (
                  <Descriptions.Item label="מאמן- תפקיד" span={3}>
                    {formData.CustomRole}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Col>
          </Row>
        )}

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
