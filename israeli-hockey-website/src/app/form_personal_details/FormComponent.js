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
  message,
} from "antd";
import "antd/dist/reset.css"; // Import Ant Design styles
import "../style.css";
import dayjs from "dayjs";

const { Title } = Typography;

export default function FormComponent({ data }) {
  const initialFormState = {
    Date_of_Birth: null,
    Full_Name: "",
    Phone: "",
    Email: "",
    Residence: "",
  };

  const fieldLabels = {
    Date_of_Birth: "תאריך לידה",
    Full_Name: "שם מלא",
    Phone: "טלפון",
    Email: "מייל",
    Residence: "כתובת",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsClient(true);
    // Initial load from props
    if (data && data.length > 0) {
      setFormData({
        Date_of_Birth: data[0].Date_of_Birth
          ? dayjs(data[0].Date_of_Birth).format("YYYY-MM-DD")
          : null,
        Full_Name: data[0].Full_Name || "",
        Phone: data[0].Phone || "",
        Email: data[0].Email || "",
        Residence: data[0].Residence || "",
      });
    }
  }, [data]);

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleDateChange = (date, dateString) => {
    setFormData((prevData) => ({
      ...prevData,
      Date_of_Birth: date ? dateString : null,
    }));
  };

  const handleSubmit = async () => {
    const final_data = { ...formData, User_ID: data[0]["User_ID"] };

    try {
      await fetch("/api/form_personal_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(final_data),
      });
    } catch (error) {
      console.error("Error updating data", error);
    }
    message.success("Personal details changed successfully");
  };
  
//   DELETED IT SINCE IT CAN ANNOY THE USER
  // const handleClearAll = () => {
  //   setFormData(initialFormState);
  // };

  useEffect(() => {
    if (isClient) {
      form.setFieldsValue({
        ...formData,
        Date_of_Birth: formData.Date_of_Birth
          ? dayjs(formData.Date_of_Birth, "YYYY-MM-DD")
          : null,
      });
    }
  }, [formData, form, isClient]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Title level={3}>טופס פרטים אישיים </Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
      >
        <Row gutter={16} align={"center"}>
          <Col span={24}>
            <Form.Item
              label={fieldLabels["Full_Name"]}
              name="Full_Name"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels["Full_Name"]} is required`,
                },
              ]}
            >
              <Input
                name="Full_Name"
                value={formData["Full_Name"]}
                onChange={(e) => handleChange({ Full_Name: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={fieldLabels["Phone"]}
              name="Phone"
            >
              <Input
                name="Phone"
                value={formData["Phone"]}
                onChange={(e) => handleChange({ Phone: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={fieldLabels["Email"]}
              name="Email"
              rules={[
                {
                  required: true,
                  message: `${fieldLabels["Email"]} is required`,
                },
              ]}
            >
              <Input
                name="Email"
                value={formData["Email"]}
                onChange={(e) => handleChange({ Email: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={fieldLabels['Residence']}
              name="Residence"
            >
              <Input
                name="Residence"
                value={formData["Residence"]}
                onChange={(e) => handleChange({ Residence: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={fieldLabels["Date_of_Birth"]}
              name="Date_of_Birth"
            >
              <DatePicker
                format="YYYY-MM-DD"
                value={
                  formData["Date_of_Birth"]
                    ? dayjs(formData["Date_of_Birth"], "YYYY-MM-DD")
                    : null
                }
                onChange={handleDateChange}
              />
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Button type="primary" htmlType="submit" block>
              Send
            </Button>
          </Col>
          <Col span={24}>
            {/* <Button type="default" onClick={handleClearAll} block>
              Clear All
            </Button> */}
          </Col>
        </Row>
      </Form>
    </div>
  );
}
