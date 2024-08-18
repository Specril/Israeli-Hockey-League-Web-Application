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
import { dataFetchLeague, dataFetchTeams } from "./fetching";

const { Title } = Typography;
const { Option } = Select;

export default function FormComponent({ data }) {
  const initialFormState = {
    Team_ID: "",
    League_ID: "",
  };

  const fieldLabels = {
    Team_ID: "שם קבוצה",
    League_ID: "ליגה",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [teamsOptions, setTeamsOptions] = useState([]);
  const [League_ID_options, setLeagueOptions] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      const fetchedLeagues = await dataFetchLeague();
      const fetchedTeams = await dataFetchTeams();
      setLeagueOptions(fetchedLeagues);
      setTeamsOptions(fetchedTeams);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem("formDeleteTeamFromLeague");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(
        "formDeleteTeamFromLeague",
        JSON.stringify(formData)
      );
    }
  }, [formData, isClient]);

  const handleChange = (changedValues) => {
    console.log("inside handle change");
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleSelectChange = (value, field) => {
    console.log("inside handle select change");
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    if (field === 'League_ID'){
      setSelectedLeague(value)
    }

  };

  const handleSubmit = async () => {
    const final_data = {
      ...formData,
      Team_ID: formData.Team_ID.includes("-")
        ? formData.Team_ID.split("-")[0]
        : formData.Team_ID,
    };

    try {
      await fetch("/api/manage_teams_in_leagues", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(final_data),
      });
    } catch (error) {
      console.error("Error updating data");
    }
        // for resetting the fields once sent
    form.resetFields();
    setFormData(initialFormState);
    setSelectedLeague(null)

    message.success("Team deleted from league successfully");
  };

  const handleClearAll = () => {
    form.resetFields();
    setFormData(initialFormState);
    setSelectedLeague(null)
    if (isClient) {
      localStorage.removeItem("formDeleteTeamFromLeague");
    }
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
      });
    }
  }, [formData, form, isClient]);

  const filteredTeams = formData.League_ID
    ? teamsOptions.filter(
        (option) => option.value.League_ID === formData.League_ID
      )
    : teamsOptions;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Title level={3}>טופס מחיקת קבוצה מליגה</Title>
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
              label={fieldLabels["League_ID"]}
              name="League_ID"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels["League_ID"]} is required`,
                },
              ]}
            >
              <Select
                value={formData["League_ID"]}
                onChange={(value) => handleSelectChange(value, "League_ID")}
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="children"
              >
                {League_ID_options.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
            {selectedLeague && <Col span={24}>
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
                {filteredTeams.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {`${option.value.Team_Name} - ${option.value.Age} - ${option.value.League_Type}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>}
          

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
