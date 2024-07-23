"use client";

import React from 'react';
import { useAuth } from './authentication/contexts/authContext';
import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const ProtectedPage = ({ content, allowed_user_types}) => {
  const { userLoggedIn, currentUser } = useAuth();

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0', margin: '0', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          {userLoggedIn ? (
            <>
              <Title level={2} style={{ marginTop: '20px' }}>ברוך הבא, {currentUser.displayName || currentUser.email}!</Title>
              <Title level={4}>זו דף מוגן.</Title>
              <div style={{ padding: '20px' }}>{content}</div>
            </>
          ) : (
            <Title level={2} style={{ marginTop: '20px' }}>אינך מחובר. אנא התחבר כדי לגשת לדף זה.</Title>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default ProtectedPage;
