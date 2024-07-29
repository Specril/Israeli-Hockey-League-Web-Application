"use client";

import React, { useState, useEffect } from 'react';
import { Select, Typography, Row, Col, Table } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";

const { Title } = Typography;
const { Option } = Select;

export default function DropdownComponent({ options, data }) {
  const [selectedAge, setSelectedAge] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (selectedAge) {
      const filtered = data.filter(item => item['גיל'] === selectedAge);
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
      title: 'גיל',
      dataIndex: 'גיל',
      key: 'גיל',
    },
    {
      title: 'קבוצת בית',
      dataIndex: 'קבוצת בית',
      key: 'קבוצת בית',
    },
    {
      title: 'קבוצת חוץ',
      dataIndex: 'קבוצת חוץ',
      key: 'קבוצת חוץ',
    },
    {
      title: 'יום',
      dataIndex: 'יום',
      key: 'יום',
    },
    {
      title: 'תאריך',
      dataIndex: 'תאריך',
      key: 'תאריך',
    },
    {
      title: 'זמן התחלה',
      dataIndex: 'זמן התחלה',
      key: 'זמן התחלה',
    },
    {
      title: 'מיקום',
      dataIndex: 'מיקום',
      key: 'מיקום',
    },
    {
      title: 'שופט 1',
      dataIndex: 'שופט 1',
      key: 'שופט 1',
    },
    {
      title: 'שופט 2',
      dataIndex: 'שופט 2',
      key: 'שופט 2',
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={3}>משחקים קרובים</Title>
      <Row gutter={16}>
        <Col span={24}>
          <Select
            style={{ width: '100%' }}
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
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Table columns={columns} dataSource={filteredData} rowKey="קבוצת בית" />
        </Col>
      </Row>
    </div>
  );
}