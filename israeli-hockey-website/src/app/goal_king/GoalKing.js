"use client";
import { Card, List, Avatar } from "antd";
import { CrownTwoTone, setTwoToneColor } from "@ant-design/icons";
import React from "react";

export default function GoalKing({ data }) {
  const top10 = data.slice(0, 10);
  setTwoToneColor("#0059b3");
  return (
    <>
      <h1>מלך השערים</h1>
      <List
        style={{ maxWidth: 400, borderRadius: "10px", overflow: "hidden" }}
        itemLayout="horizontal"
        dataSource={top10}
        renderItem={(item, index) => {
          if (index === 0) {
            return (
              <List.Item style={{ backgroundColor: "blue" }}>
                <List.Item.Meta
                  avatar={<Avatar src={item["סמל קבוצה"]} />}
                  title={
                    <span
                      style={{
                        fontSize: "20px",
                        color: "white",
                      }}
                    >
                      {index + 1}. {item["שם השחקן"]}
                    </span>
                  }
                />
                <div style={{ fontSize: "20px", color: "white" }}>
                  {item["כמות גולים"]}
                </div>
                <CrownTwoTone twoToneColor="yellow" />
              </List.Item>
            );
          } else {
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item["סמל קבוצה"]} />}
                  title={
                    <span>
                      {index + 1}. {item["שם השחקן"]}
                    </span>
                  }
                />
                <div>{item["כמות גולים"]}</div>
              </List.Item>
            );
          }
        }}
      />
    </>
  );
}
