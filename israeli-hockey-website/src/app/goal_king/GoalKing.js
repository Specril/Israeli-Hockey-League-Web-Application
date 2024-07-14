"use client";
import { Card, Row, Col, Table } from "antd";
import React from "react";

const gridStyle = {
  width: "100%",
};

export default function GoalKing({ data }) {
  const columns = [
    {
      title: "שם השחקן",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "כמות גולים",
      dataIndex: "goals",
      key: "goals",
    },
  ];
  return (
    <div style={{ padding: "20px" }}>
      <h2>Goals</h2>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            hoverable
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
              marginBottom: "20px",
              background: "#f0f2f5",
              border: "2px solid #1890ff",
            }}
          >
            <img
              src="path-to-image" // Replace with the path to your image
              alt={data[0].name}
              style={{ height: "80px", marginBottom: "16px" }}
            />
            <h3>{data[0].name}</h3>
            <p>{data[0].goals} Goals</p>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Table
            dataSource={data.slice(1)}
            columns={columns}
            pagination={false}
            rowKey="name"
          />
        </Col>
      </Row>
    </div>
  );
}
