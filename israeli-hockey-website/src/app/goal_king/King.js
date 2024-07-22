"use client";
import { List, Avatar, Tooltip } from "antd";
import { CrownFilled } from "@ant-design/icons";
import React, { useState } from "react";

export default function King({ data, header, backgroundColorFirst }) {
  return (
    <>
      <List
        header={<h1>{header}</h1>}
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
              <List.Item
                style={{
                  backgroundColor: backgroundColorFirst,
                  padding: "10px",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Tooltip title={item["שם הקבוצה"]}>
                      <Avatar src={item["סמל קבוצה"]} />
                    </Tooltip>
                  }
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
                      <CrownFilled
                        style={{ color: "yellow", marginRight: "5px" }}
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
                  avatar={
                    <Tooltip title={item["שם הקבוצה"]}>
                      <Avatar src={item["סמל קבוצה"]} />
                    </Tooltip>
                  }
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
