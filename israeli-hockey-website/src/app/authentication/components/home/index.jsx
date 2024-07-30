"use client";

import React, { useEffect, useState } from 'react';
import { Layout, Typography } from 'antd';
import { useAuth } from '../../contexts/authContext';
import { getAuth, updateProfile } from "firebase/auth";
const auth = getAuth();

const { Content } = Layout;
const { Title } = Typography;

const userTypes = {
  coach: 'משתמש מאמן',
  referee: 'משתמש שופט',
  admin: 'משתמש מנהל',
  player: 'משתמש שחקן',
  fan: 'משתמש אוהד',
};

const Home = () => {
  const { currentUser } = useAuth();
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const name = currentUser?.displayName ? currentUser.displayName : currentUser?.email;

  useEffect(() => {
    if (currentUser) {
      console.log("currentuser:", currentUser);
      const userTypeKey = currentUser.photoURL;
      if (userTypeKey) {
        setUserType(userTypes[userTypeKey]);
      } else {
        setUserType('סוג משתמש לא ידוע');
      }
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Title level={2}>טוען...</Title>
      </div>
    );
  }

  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>שלום {name}, אתה מחובר עכשיו.</Title>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
