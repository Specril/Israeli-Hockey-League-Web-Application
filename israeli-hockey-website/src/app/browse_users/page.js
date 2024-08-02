"use client";

import { useEffect, useState, useRef } from "react";
import { Select, Table, Card, Row, Col, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const { Option } = Select;

const query_users_admin = `
SELECT Users.*
FROM UsersAdmin
JOIN Users ON UsersAdmin.User_ID = Users.User_ID;
`;

const query_users_coaches = `
SELECT Users.*
FROM UsersCoaches
JOIN Users ON UsersCoaches.User_ID = Users.User_ID;
`;

const query_users_fans = `
SELECT Users.*
FROM UsersFans
JOIN Users ON UsersFans.User_ID = Users.User_ID;
`;

const query_users_players = `
SELECT Users.*
FROM UsersPlayers
JOIN Users ON UsersPlayers.User_ID = Users.User_ID;
`;

const query_users_referees = `
SELECT Users.*
FROM UsersReferees
JOIN Users ON UsersReferees.User_ID = Users.User_ID;
`;

// Function to fetch data from the API
async function fetchData(query) {
  let data = [];
  try {
    const response = await fetch(`/api/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

const BrowseUsers = () => {
  const [selectedRole, setSelectedRole] = useState("Admins");
  const [usersData, setUsersData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const fetchUsers = async (role) => {
    let query = "";
    switch (role) {
      case "Admins":
        query = query_users_admin;
        break;
      case "Coaches":
        query = query_users_coaches;
        break;
      case "Fans":
        query = query_users_fans;
        break;
      case "Players":
        query = query_users_players;
        break;
      case "Referees":
        query = query_users_referees;
        break;
      default:
        break;
    }

    const data = await fetchData(query);
    setUsersData(data);
  };

  useEffect(() => {
    fetchUsers(selectedRole);
  }, [selectedRole]);

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "User_ID",
      key: "User_ID",
      ...getColumnSearchProps("User_ID"),
    },
    {
      title: "Full Name",
      dataIndex: "Full_Name",
      key: "Full_Name",
      ...getColumnSearchProps("Full_Name"),
    },
    {
      title: "Date of Birth",
      dataIndex: "Date_of_Birth",
      key: "Date_of_Birth",
      ...getColumnSearchProps("Date_of_Birth"),
    },
    {
      title: "Phone",
      dataIndex: "Phone",
      key: "Phone",
      ...getColumnSearchProps("Phone"),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      ...getColumnSearchProps("Email"),
    },
    {
      title: "UID",
      dataIndex: "UID",
      key: "UID",
      ...getColumnSearchProps("UID"),
    },
    {
      title: "Residence",
      dataIndex: "Residence",
      key: "Residence",
      ...getColumnSearchProps("Residence"),
    },
  ];

  return (
    <Row align="center" justify="center" style={{ padding: "20px" }}>
      <Col span={24}>
        <Select
          style={{ width: 200, marginBottom: 20 }}
          placeholder="Select a role"
          onChange={handleRoleChange}
          value={selectedRole}
        >
          <Option value="Admins">אדמינים</Option>
          <Option value="Coaches">מאמנים</Option>
          <Option value="Fans">אוהדים</Option>
          <Option value="Players">שחקנים</Option>
          <Option value="Referees">שופטים</Option>
        </Select>
      </Col>
      <Col span={24}>
        <Card bordered={false} style={{ width: "100%" }}>
          <Table dataSource={usersData} columns={columns} rowKey="User_ID" />
        </Card>
      </Col>
    </Row>
  );
};

export default BrowseUsers;
