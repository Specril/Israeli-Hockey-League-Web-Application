"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Select,
  InputNumber,
  message,
} from "antd";
import "antd/dist/reset.css";
import "../style.css";
import { dataFetchTeams, dataFetchUsers } from "./fetching";

const { Title } = Typography;
const { Option } = Select;

export default function FormComponent() {
  const initialFormState = {
    User_ID: "",
    Team_ID: "",
    Position: "",
    Shirt_Number: null,
  };

  const fieldLabels = {
    User_ID: "שם מלא",
    Team_ID: "קבוצה",
    Position: "תפקיד",
    Shirt_Number: "מספר חולצה",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [Team_IDOptions, setTeamsOptions] = useState([]);
  const [users_options, setUsersOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await dataFetchUsers();
      const fetchedTeams = await dataFetchTeams();
      setTeamsOptions(fetchedTeams);
      setUsersOptions(fetchedUsers);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem("formPlayer");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("formPlayer", JSON.stringify(formData));
    }
  }, [formData, isClient]);

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleSelectChange = (value, field) => {
    // const selectedOption = Team_IDOptions.find(option => option.Team_ID === value);
    // const concatenatedValue = selectedOption ? `${value}-${selectedOption.League_Name}` : value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSelectChangeName = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const final_data = { ...formData };

    try {
      await fetch("/api/form_manage_player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(final_data),
      });
    } catch (error) {
      console.alert("Error updating data");
    }
        // for resetting the fields once sent
    form.resetFields();
    setFormData(initialFormState);
    message.success("Player added successfully");
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    if (isClient) {
      localStorage.removeItem("formPlayer");
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Title level={3}>טופס הוספת שחקן לקבוצה</Title>
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
              label={fieldLabels["User_ID"]}
              name="User_ID"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels["User_ID"]} is required`,
                },
              ]}
            >
              <Select
                showSearch
                value={formData["User_ID"]}
                onChange={(value) => handleSelectChangeName(value, "User_ID")}
                filterOption={(input, option) =>
                  option.props.children
                    ? option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    : false
                }
              >
                {users_options.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={fieldLabels["Team_ID"]}
              name="Team_ID"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels["Team_ID"]} is required`,
                },
              ]}
            >
              <Select
                value={formData["Team_ID"]}
                onChange={(value) => handleSelectChange(value, "Team_ID")}
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="children"
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
            <Form.Item label={fieldLabels["Position"]} name="Position">
              <Input
                name="Position"
                value={formData["Position"]}
                onChange={(e) => handleChange({ Position: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={fieldLabels["Shirt_Number"]}
              name="Shirt_Number"
              rules={[
                {
                  type: "number",
                  message: `${fieldLabels["Shirt_Number"]} must be a number`,
                  min: 1,
                  max: 100,
                },
                {
                  validator: (_, value) => {
                    if (
                      value === null ||
                      (Number.isInteger(value) && value >= 0)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      `${fieldLabels["Shirt_Number"]} must be a non-negative integer`
                    );
                  },
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                max={100}
                precision={0}
                value={formData["Shirt_Number"]}
                onChange={(value) => handleChange({ Shirt_Number: value })}
              />
            </Form.Item>
          </Col>

          <Col span={12}></Col>
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
