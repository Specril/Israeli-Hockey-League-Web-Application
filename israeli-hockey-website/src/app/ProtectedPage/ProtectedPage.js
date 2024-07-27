"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/contexts/authContext';
import { Layout, Typography } from 'antd';
import getUserType from './GetUserType';

const { Content } = Layout;
const { Title } = Typography;

const ProtectedPage = ({ content, allowed_user_types = []}) => {
  const { userLoggedIn, currentUser } = useAuth();
  const [userType, setUserType] = useState(null);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const fetchUserType = async () => {
      if (currentUser) {
        const data = await getUserType(currentUser);
        setUserType(data);

        // Ensure allowed_user_types always includes "admin"
        const extendedAllowedUserTypes = [...new Set([...allowed_user_types, 'admin'])];

        // Check if any allowed type is present in the user type object
        if (Array.isArray(extendedAllowedUserTypes) && extendedAllowedUserTypes.some(type => data.result[type] === 1)) {
          setIsAllowed(true);
          console.log("User type: ", data);
        } else {
          setIsAllowed(false);
          console.log("User type not allowed: ", data);
        }
      }
    };

    fetchUserType();
  }, [currentUser, allowed_user_types]);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0', margin: '0', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          {userLoggedIn ? (
            userType ? (
              isAllowed ? (
                <>
                  <div style={{ padding: '20px' }}>{content}</div>
                </>
              ) : (
                <Title level={2} style={{ marginTop: '20px' }}>אינך מורשה לגשת לדף זה.</Title>
              )
            ) : (
              <Title level={4}>בודק גישות...</Title>
            )
          ) : (
            <Title level={2} style={{ marginTop: '20px' }}>אינך מחובר. אנא התחבר כדי לגשת לדף זה.</Title>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default ProtectedPage;
