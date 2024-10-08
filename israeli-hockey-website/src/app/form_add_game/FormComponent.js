"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  DatePicker,
  Select,
  TimePicker,
  message,
} from "antd";
import "antd/dist/reset.css"; // Import Ant Design styles
import "../style.css"; // Ensure you have the correct path for your CSS
import moment from "moment";
import dayjs from "dayjs";
import {
  dataFetchLeague,
  dataFetchTeams,
  dataFetchLocations,
  dataFetchReferees,
} from "./fetching";

const { Title } = Typography;
const { Option } = Select;

export default function AddGameForm({ data }) {
  const initialFormState = {
    Date: "",
    Day: "",
    Start_Time: "",
    League_ID: "",
    Home_Team_ID: "",
    Away_Team_ID: "",
    Location_ID: "",
    Referee_ID: "",
    Second_Referee_ID: "",
  };

  const fieldLabels = {
    Date: "תאריך",
    Day: "יום",
    Start_Time: "שעה",
    League_ID: "ליגה",
    Home_Team_ID: "קבוצת בית",
    Away_Team_ID: "קבוצת חוץ",
    Location_ID: "מיקום",
    Referee_ID: "שופט 1",
    Second_Referee_ID: "שופט 2",
  };

  const DayOptions = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  // const League_ID_options = data[1];
  // const locations_options = data[2];
  // const Referee_IDOptions =data[3];
  // const teams = data[0]

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [form] = Form.useForm();
  const [League_ID_options, setLeagueOptions] = useState([]);
  const [locations_options, setLocationOptions] = useState([]);
  const [Referee_IDOptions, setRefereesOptions] = useState([]);
  const [teams, setTeamsOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLeagues = await dataFetchLeague();
      const fetchedLocations = await dataFetchLocations();
      const fetchedTeams = await dataFetchTeams();
      const fetchedReferees = await dataFetchReferees();
      setLeagueOptions(fetchedLeagues);
      setLocationOptions(fetchedLocations);
      setTeamsOptions(fetchedTeams);
      setRefereesOptions(fetchedReferees);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem("formDataGames");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("formDataGames", JSON.stringify(formData));
    }
  }, [formData, isClient]);

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));

    if (changedValues.League_ID) {
      setSelectedLeague(changedValues.League_ID);
    }
  };

  const getTeams = (leagueID) => {
    return teams.filter(team => team.League_ID === leagueID);
  };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
        Date: formData.Date ? dayjs(formData.Date, 'YYYY-MM-DD') : null,
        Start_Time: formData.Start_Time ? dayjs(formData.Start_Time, 'HH:mm') : null,
      });
    }
  }, [formData, form, isClient]);

  const handleDateChange = (date, dateString) => {
    setFormData(prevData => ({
      ...prevData,
      Date: date ? date.format('YYYY-MM-DD') : '',
    }));
  };
  
  const handleTimeChange = (time, timeString) => {
    setFormData(prevData => ({
      ...prevData,
      Start_Time: time ? time.format('HH:mm') : '',
    }));
  };

  const handleSelectChange = (value, field) => {
    // Find the location name from the selected ID
    if (field === 'Location_ID') {
      const location = locations_options.find(option => option.key === value);
      setFormData(prevData => ({
        ...prevData,
        [field]: value,
        Location: location ? location.value : '',
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/form_manage_game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert('Error: ' + (errorData.message || 'Failed to submit form'));
        return;
      }

      const result = await response.json();
      console.log('Success:', result);
      alert('Form submitted successfully!');

    } catch (error) {
      console.error('Error:', error);
      alert('Error updating data');
    }
    // for resetting the fields once sent
    setFormData(initialFormState);
    setSelectedLeague(null);
    message.success("Game added successfully");
  };

  const handleClearAll = () => {
    setFormData(initialFormState);
    setSelectedLeague(null);
    if (isClient) {
      localStorage.removeItem("formDataGames");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Title level={3}>טופס העלאת פרטי משחק חדש</Title>
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
              label={fieldLabels["Date"]}
              name="Date"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels["Date"]} is required`,
                },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                value={
                  formData["Date"]
                    ? dayjs(formData["Date"], "YYYY-MM-DD")
                    : null
                }
                onChange={handleDateChange}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={fieldLabels["Start_Time"]}
              name="Start_Time"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels["Start_Time"]} is required`,
                },
              ]}
            >
              <TimePicker
                format="HH:mm"
                value={formData['Start_Time'] ? dayjs(formData['Start_Time'], 'HH:mm') : null}
                onChange={handleTimeChange}
                style={{ width: '100%' }}
                minuteStep={1}
                hourStep={1}
              />
            </Form.Item>
          </Col>

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
                showSearch
                value={formData["League_ID"]}
                onChange={(value) => handleSelectChange(value, "League_ID")}
                style={{ width: "100%" }}
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
        </Row>

        {selectedLeague && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={fieldLabels["Home_Team_ID"]}
                name="Home_Team_ID"
                rules={[
                  {
                    required: true,
                    message: `${fieldLabels["Home_Team_ID"]} is required`,
                  },
                ]}
              >
                <Select
                  placeholder="קבוצת בית"
                  value={formData["Home_Team_ID"]}
                  onChange={(value) =>
                    handleSelectChange(value, "Home_Team_ID")
                  }
                  style={{ width: "100%" }}
                >
                  {getTeams(selectedLeague).map((team) => (
                    <Option key={team.Team_ID} value={team.Team_ID}>
                      {team.Team_Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={fieldLabels["Away_Team_ID"]}
                name="Away_Team_ID"
                rules={[
                  {
                    required: true,
                    message: `${fieldLabels["Away_Team_ID"]} is required`,
                  },
                ]}
              >
                <Select
                  placeholder="קבוצת חוץ"
                  value={formData["Away_Team_ID"]}
                  onChange={(value) =>
                    handleSelectChange(value, "Away_Team_ID")
                  }
                  style={{ width: "100%" }}
                >
                  {getTeams(selectedLeague).map((team) => (
                    <Option key={team.Team_ID} value={team.Team_ID}>
                      {team.Team_Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={fieldLabels['Location_ID']}
                name="Location_ID"
              >
                <Select
                  value={formData["Location_ID"]}
                  onChange={(value) => handleSelectChange(value, "Location_ID")}
                  style={{ width: "100%" }}
                >
                  {locations_options.map((option) => (
                    <Option key={option.key} value={option.key}>
                      {option.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={fieldLabels['Referee_ID']}
                name="Referee_ID"
              >
                <Select
                  showSearch
                  value={formData["Referee_ID"]}
                  onChange={(value) => handleSelectChange(value, "Referee_ID")}
                  style={{ width: "100%" }}
                  filterOption={(input, option) =>
                    option.props.children
                      ? option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      : false
                  }
                >
                  {Referee_IDOptions.map((option) => (
                    <Option key={option.key} value={option.key}>
                      {option.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={fieldLabels["Second_Referee_ID"]}
                name="Second_Referee_ID"
              >
                <Select
                  showSearch
                  value={formData["Second_Referee_ID"]}
                  onChange={(value) =>
                    handleSelectChange(value, "Second_Referee_ID")
                  }
                  style={{ width: "100%" }}
                  filterOption={(input, option) =>
                    option.props.children
                      ? option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      : false
                  }
                >
                  {Referee_IDOptions.map((option) => (
                    <Option key={option.key} value={option.key}>
                      {option.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
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
