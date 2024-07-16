"use client";
import { Card, List, Avatar } from "antd";
import { CrownTwoTone, setTwoToneColor } from "@ant-design/icons";
import React from "react";

export default function GoalKing({ data, header, firstPlaceColor }) {
  return (
    <>
      <List
        header={<h1>{header}</h1>}
        style={{ width: 400, borderRadius: "10px", overflow: "hidden" }}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => {
          if (index === 0) {
            return (
              <List.Item
                style={{
                  backgroundColor: { firstPlaceColor },
                  padding: "10px",
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item["סמל קבוצה"]} />}
                  title={
                    <div>
                      <span
                        style={{
                          fontSize: "25px",
                          color: "white",
                        }}
                      >
                        {index + 1}. {item["שם השחקן"]}
                      </span>
                      <CrownTwoTone
                        twoToneColor="yellow"
                        style={{ marginRight: "5px" }}
                      />
                    </div>
                  }
                />
                <div style={{ fontSize: "25px", color: "white" }}>
                  {item["כמות גולים"]}
                </div>
              </List.Item>
            );
          } else {
            return (
              <List.Item style={{ padding: "10px" }}>
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
