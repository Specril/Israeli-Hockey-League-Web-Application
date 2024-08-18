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
import { dataFetchPlayers, dataFetchTeams } from "./fetching";

const { Title } = Typography;
const { Option } = Select;

export default function FormComponent({ data }) {
  const initialFormState = {
    User_ID: "",
    Team_ID: "",
  };

  const fieldLabels = {
    User_ID: "שם מלא",
    Team_ID: "קבוצה",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [Team_IDOptions, setTeamsOptions] = useState([]);
  const [users_options, setUsersOptions] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTeams = await dataFetchTeams();
      const fetchedPlayers = await dataFetchPlayers();
      const players = fetchedPlayers.map((user) => ({
        key: user.User_ID,
        value: {
          Full_Name: user.Full_Name,
          Team_ID: user.Team_ID,
        },
      }));
      setTeamsOptions(fetchedTeams);
      setUsersOptions(players);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem("formDeletePlayer");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("formDeletePlayer", JSON.stringify(formData));
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
    if (field === "Team_ID") {
      setSelectedTeam(value);
    }
  };

  const handleSubmit = async () => {
    const final_data = { ...formData };

    try {
      const response = await fetch("/api/form_manage_player", {
        // change name to manage player and change method
        method: "DELETE",
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
    setSelectedTeam(null)
    message.success("Player deleted successfully");
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    setSelectedTeam(null)
    if (isClient) {
      localStorage.removeItem("formDeletePlayer");
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
        Date_of_Birth: formData.Date_of_Birth
          ? moment(formData.Date_of_Birth)
          : null, // Set date value using moment
      });
    }
  }, [formData, form, isClient]);

  const filteredPlayers = formData.Team_ID
    ? users_options.filter(
        (option) => option.value.Team_ID === formData.Team_ID
      )
    : Team_IDOptions;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Title level={3}>טופס מחיקת שחקן מקבוצה</Title>
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
          {selectedTeam && (
            <Col span={24}>
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
                  value={formData["User_ID"]}
                  onChange={(value) => handleSelectChange(value, "User_ID")}
                  showSearch
                  optionFilterProp="children"
                >
                  {filteredPlayers.map((option) => (
                    <Option key={option.key} value={option.key}>
                      {option.value.Full_Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
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
