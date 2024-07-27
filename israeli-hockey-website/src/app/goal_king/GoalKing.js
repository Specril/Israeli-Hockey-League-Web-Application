"use client";
import { Card, List, Avatar } from "antd";
import { CrownTwoTone, setTwoToneColor } from "@ant-design/icons";
import React, { useState } from "react";

export default function GoalKing({ data }) {
  return (
    <>
      <List
        header={<h1>מלך השערים</h1>}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: false,
          align: "center",
        }}
        style={{ width: 400, borderRadius: "10px", overflow: "hidden" }}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => {
          if (item["מקום"] == 1) {
            return (
              <List.Item style={{ backgroundColor: "blue", padding: "10px" }}>
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
                        {item["מקום"]}. {item["שם השחקן"]}
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
                      {item["מקום"]}. {item["שם השחקן"]}
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
