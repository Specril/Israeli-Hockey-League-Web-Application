"use client";
import React, { useState, useEffect } from "react";
import { Select, Typography, Row, Col, Table } from "antd";
import "antd/dist/reset.css";
import "../style.css"; // Ensure this import is correct

const { Title } = Typography;
const { Option } = Select;

// Helper functions to format date and time
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (timeString) => {
  const time = new Date(timeString);
  const hours = time.getUTCHours().toString().padStart(2, "0");
  const minutes = time.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function DropdownComponent({ options, data }) {
  const [selectedAge, setSelectedAge] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (selectedAge) {
      const filtered = data.filter((item) => item["גיל"] === selectedAge);
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [selectedAge, data]);

  const handleAgeChange = (value) => {
    setSelectedAge(value);
  };

  const columns = [
    {
      title: "גיל",
      dataIndex: "גיל",
      key: "גיל",
    },
    {
      title: "קבוצת בית",
      dataIndex: "קבוצת בית",
      key: "קבוצת בית",
    },
    {
      title: "קבוצת חוץ",
      dataIndex: "קבוצת חוץ",
      key: "קבוצת חוץ",
    },
    {
      title: "יום",
      dataIndex: "יום",
      key: "יום",
    },
    {
      title: "תאריך",
      dataIndex: "תאריך",
      key: "תאריך",
      render: (text) => formatDate(text), // Format date using helper function
    },
    {
      title: "זמן התחלה",
      dataIndex: "זמן התחלה",
      key: "זמן התחלה",
      render: (text) => formatTime(text), // Format time using helper function
    },
    {
      title: "מיקום",
      dataIndex: "מיקום",
      key: "מיקום",
    },
    {
      title: "שופט 1",
      dataIndex: "שופט 1",
      key: "שופט 1",
    },
    {
      title: "שופט 2",
      dataIndex: "שופט 2",
      key: "שופט 2",
    },
  ];

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto", padding: "20px" }}>
      <Title level={3}>משחקים קרובים</Title>
      <Row gutter={16}>
        <Col span={24}>
          <Select
            showSearch
            optionFilterProp="children"
            style={{ width: "100%" }}
            placeholder="בחר גיל"
            onChange={handleAgeChange}
            allowClear
          >
            {options.map((age, index) => (
              <Option key={index} value={age}>
                {age}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="קבוצת בית"
            className="custom-table" // Apply custom table class
          />
        </Col>
      </Row>
    </div>
  );
}
