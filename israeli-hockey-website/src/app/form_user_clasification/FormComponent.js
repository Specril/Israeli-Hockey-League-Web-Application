import React, { useState, useEffect } from 'react';
import { Form, Button, Typography, Row, Col, Select, Checkbox, Input, message } from 'antd';
import 'antd/dist/reset.css';
import "../style.css";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function FormComponent({ data }) {
  const initialFormState = {
    User_ID: '',
    Clasification: [],
    CustomRole: ''
  };

  const fieldLabels = {
    User_ID: 'שם מלא',
    Clasification: 'בחר סיווגים שתרצה להוסיף למשתמש',
    CustomRole: 'מאמן- תפקיד',
    ClasificationsToDelete: 'בחר סיווגים שתרצה להוריד למשתמש'
  };

  const usersOptions = data[0]; // User options
  const clasificationOptions = [
    { key: 'Users_Admin', value: 'אדמין' },
    { key: 'Users-Referees', value: 'שופט' },
    { key: 'Users-Players', value: 'שחקן' },
    { key: 'Users-Fans', value: 'אוהד' },
    { key: 'Users-Coaches', value: 'מאמן' }
  ];

  const roleKeys = {
    'Users_Admin': 'admin',
    'Users-Referees': 'referee',
    'Users-Players': 'player',
    'Users-Fans': 'fan',
    'Users-Coaches': 'coach'
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [customRole, setCustomRole] = useState('');
  const [userTables, setUserTables] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [availableClasifications, setAvailableClasifications] = useState([]);
  const [selectedClasificationsToAdd, setSelectedClasificationsToAdd] = useState([]);
  const [selectedClasificationsToDelete, setSelectedClasificationsToDelete] = useState([]);
  const [userClasifications, setUserClasifications] = useState([]);

  useEffect(() => {
    setIsClient(true);
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData, isClient]);

  const fetchUserTables = async (userId) => {
    let tables = [];
    const queries = [
      `SELECT N'אדמין' as Table_Name FROM UsersAdmin WHERE User_ID = '${userId}';`,
      `SELECT N'שופט' as Table_Name FROM UsersReferees WHERE User_ID = '${userId}';`,
      `SELECT N'שחקן' as Table_Name FROM UsersPlayers WHERE User_ID = '${userId}';`,
      `SELECT N'אוהד' as Table_Name FROM UsersFans WHERE User_ID = '${userId}';`,
      `SELECT N'מאמן' as Table_Name FROM UsersCoaches WHERE User_ID = '${userId}';`
    ];

    try {
      for (const query of queries) {
        const response = await fetch('/api/fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        if (result.length > 0) tables.push(result[0].Table_Name);
      }
    } catch (error) {
      console.error('Error fetching user tables:', error);
    }

    return tables;
  };

  const fetchUserClasifications = async (userId) => {
    let clasifications = [];
    const queries = [
      `SELECT 'Users_Admin' as Clasification FROM UsersAdmin WHERE User_ID = '${userId}';`,
      `SELECT 'Users-Referees' as Clasification FROM UsersReferees WHERE User_ID = '${userId}';`,
      `SELECT 'Users-Players' as Clasification FROM UsersPlayers WHERE User_ID = '${userId}';`,
      `SELECT 'Users-Fans' as Clasification FROM UsersFans WHERE User_ID = '${userId}';`,
      `SELECT 'Users-Coaches' as Clasification FROM UsersCoaches WHERE User_ID = '${userId}';`
    ];

    try {
      for (const query of queries) {
        const response = await fetch('/api/fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        if (result.length > 0) clasifications.push(result[0].Clasification);
      }
    } catch (error) {
      console.error('Error fetching user classifications:', error);
    }

    return clasifications;
  };

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleSelectChange = async (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    const user = usersOptions.find(user => user.key === value);
    setSelectedUser(user || null);

    if (user) {
      const tables = await fetchUserTables(user.key);
      setUserTables(tables);

      const availableClasifications = clasificationOptions
        .filter(option => !tables.includes(option.value)) // Filter based on tables user is not in
        .map(option => ({ label: option.value, value: option.key }));

      setAvailableClasifications(availableClasifications);

      // Fetch user classifications
      const clasifications = await fetchUserClasifications(user.key);
      const userClasificationsWithLabels = clasifications
        .map(clas => clasificationOptions.find(option => option.key === clas))
        .filter(option => option)
        .map(option => ({ label: option.value, value: option.key }));
      
      setUserClasifications(userClasificationsWithLabels);
    } else {
      setUserTables([]);
      setAvailableClasifications([]);
      setUserClasifications([]);
    }
  };

  const handleCheckboxChangeToAdd = (checkedValues) => {
    setSelectedClasificationsToAdd(checkedValues);
  };

  const handleCheckboxChangeToDelete = (checkedValues) => {
    setSelectedClasificationsToDelete(checkedValues);
  };

  const handleCustomRoleChange = (e) => {
    setCustomRole(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      CustomRole: e.target.value,
    }));
  };

  const handleAdd = async () => {
    if (selectedClasificationsToAdd.length === 0) {
      message.error('בחר לפחות סיווג אחד');
      return;
    }

    const roleData = clasificationOptions.reduce((acc, role) => {
      acc[roleKeys[role.key]] = selectedClasificationsToAdd.includes(role.key) ? 1 : 0;
      return acc;
    }, {});

    const finalData = {
      User_ID: formData.User_ID,
      ...roleData,
      CustomRole: formData.Clasification.includes('Users-Coaches') ? formData.CustomRole : ''
    };

    try {
      const response = await fetch('/api/manage_users_types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      message.success('Classifications added successfully');
      handleClearAll(); // Clear form after successful addition
    } catch (error) {
      console.error('Error adding classifications:', error);
      message.error('Error adding classifications');
    }
  };

  const handleDelete = async () => {
    if (!formData.User_ID) {
      message.error('בחר משתמש');
      return;
    }
  
    if (selectedClasificationsToDelete.length === 0) {
      message.error('בחר סיווג אחד לפחות');
      return;
    }
  
    // Construct the role data based on selected classifications to delete
    const roleData = clasificationOptions.reduce((acc, role) => {
      acc[roleKeys[role.key]] = selectedClasificationsToDelete.includes(role.key) ? 1 : 0;
      return acc;
    }, {});
  
    const finalData = {
      User_ID: formData.User_ID,
      ...roleData
    };
  
    try {
      const response = await fetch('/api/manage_users_types', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      message.success('Classifications deleted successfully');
      handleClearAll(); // Clear form after successful deletion
    } catch (error) {
      console.error('Error deleting classifications:', error);
      message.error('Error deleting classifications');
    }
  };

  const handleClearAll = () => {
    setFormData(initialFormState);
    setSelectedClasificationsToAdd([]);
    setSelectedClasificationsToDelete([]);
    setCustomRole('');
  };

  return (
    <div className='form-container'>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={handleChange}
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <Form.Item label={fieldLabels.User_ID}>
          <Select
            placeholder="בחר משתמש"
            value={formData.User_ID}
            onChange={(value) => handleSelectChange(value, 'User_ID')}
          >
            {usersOptions.map((user) => (
              <Option key={user.key} value={user.key}>
                {user.value}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedUser && (
          <>
            <Form.Item label={fieldLabels.Clasification}>
              <Checkbox.Group
                options={availableClasifications}
                value={selectedClasificationsToAdd}
                onChange={handleCheckboxChangeToAdd}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Button
                  type="primary"
                  onClick={handleAdd}
                >
                  הוסף סיווגים
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="default"
                  onClick={handleClearAll}
                >
                  ניקוי
                </Button>
              </Col>
            </Row>

            <Form.Item label={fieldLabels.ClasificationsToDelete}>
              <Checkbox.Group
                options={userClasifications}
                value={selectedClasificationsToDelete}
                onChange={handleCheckboxChangeToDelete}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Button
                  type="danger"
                  onClick={handleDelete}
                >
                  מחק סיווגים
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="default"
                  onClick={handleClearAll}
                >
                  ניקוי
                </Button>
              </Col>
            </Row>

            {formData.Clasification.includes('Users-Coaches') && (
              <Form.Item label={fieldLabels.CustomRole}>
                <TextArea
                  value={customRole}
                  onChange={handleCustomRoleChange}
                  placeholder="הזן תפקיד מותאם אישית"
                  rows={4}
                />
              </Form.Item>
            )}
          </>
        )}
      </Form>
    </div>
  );
}
