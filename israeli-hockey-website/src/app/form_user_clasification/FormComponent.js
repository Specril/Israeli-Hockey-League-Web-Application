"use client"
import React, { useState, useEffect } from 'react';
import { Form, Button, Typography, Row, Col, Select, Checkbox, Descriptions } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";

const { Title } = Typography;
const { Option } = Select;

export default function FormComponent({ data }) {
  const initialFormState = {
    User_ID: '',
    Roles: []
  };

  const fieldLabels = {
    User_ID: 'שם מלא',
    Roles: 'תפקידים'
  };

  const usersOptions = data[0]; // User options
  const rolesOptions = [
    { key: 'Users_Admin', value: 'אדמין' },
    { key: 'Users-Referees', value: 'שופט' },
    { key: 'Users-Players', value: 'שחקן' },
    { key: 'Users-Fans', value: 'אוהד' },
    { key: 'Users-Coaches', value: 'מאמן' }
  ]; // Predefined roles

  // Additional state to hold selected user details
  const [selectedUser, setSelectedUser] = useState(null);

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
      Roles: checkedValues,
    }));
  };

  const handleSubmit = async () => {
    const finalData = { ...formData };

    alert('Form Data JSON: ' + JSON.stringify(finalData));

    try {
      await fetch('/api/form_add_roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    setSelectedUser(null); // Clear selected user details
    if (isClient) {
      localStorage.removeItem('formData');
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
      <Title level={3}>טופס הגדרת תפקידים למשתמש</Title>
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
              label={fieldLabels['Roles']}
              name="Roles"
            >
              <Checkbox.Group
                value={formData['Roles']}
                onChange={handleCheckboxChange}
              >
                <Row>
                  {rolesOptions.map(role => (
                    <Col span={8} key={role.key}>
                      <Checkbox value={role.key}>{role.value}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Display selected user details */}
        {selectedUser && (
          <Row gutter={16}>
            <Col span={24}>
              <Title level={4}>פרטי המשתמש הנבחר</Title>
              <Descriptions bordered>
                <Descriptions.Item label="שם מלא" span={3}>
                  {selectedUser.value}
                </Descriptions.Item>
                <Descriptions.Item label="תפקידים" span={3}>
                  {formData.Roles.map(roleKey => {
                    const role = rolesOptions.find(r => r.key === roleKey);
                    return role ? role.value : null;
                  }).join(', ')}
                </Descriptions.Item>
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
