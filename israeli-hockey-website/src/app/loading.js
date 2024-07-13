import { Spin, Flex, Skeleton } from "antd";
import React from "react";

const loading = () => {
  return (
    <>
      <Skeleton active></Skeleton>
      <Spin size="large" />
      <h1>adadadDADADADA</h1>
    </>
  );
};

export default loading;
