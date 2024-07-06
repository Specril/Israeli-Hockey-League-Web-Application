"use client";

import React, { useEffect, useState } from 'react';
import { Layout, Typography } from 'antd';
import { useAuth } from '../../contexts/authContext';

const { Content } = Layout;
const { Title } = Typography;

const userTypes = {
  coach: 'משתמש מאמן',
  referee: 'משתמש שופט',
  admin: 'משתמש מנהל'
};

const userTypeMapping = {
  '5jNBtjoDHleTFpxlGEPJZzPSszh2': 'coach',
  '8nbsEbm2YAWg1erGuhjxEFMsJrg2': 'referee',
  'X8F8sEu7XORGctSFwIsWm3ArhZs1': 'admin'
};

const Home = () => {
  const { currentUser } = useAuth();
  const [userType, setUserType] = useState(null);
  const name = currentUser.displayName ? currentUser.displayName : currentUser.email;

  useEffect(() => {
    if (currentUser) {
      const userTypeKey = userTypeMapping[currentUser.uid];
      if (userTypeKey) {
        setUserType(userTypes[userTypeKey]);
      } else {
        setUserType('סוג משתמש לא ידוע');
      }
    }
  }, [currentUser]);

  return (
    <Layout className="layout" style={{ height: '100vh' }}>
      <Content style={{ padding: '0 50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>שלום {name}, אתה מחובר עכשיו.</Title>
          {userType && <Title level={4}>סוג המשתמש שלך הוא: {userType}</Title>}
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
