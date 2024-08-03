"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/contexts/authContext';
import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const ProtectedPage = ({ content, allowed_user_types = [] }) => {
  const { userLoggedIn, currentUser } = useAuth();
  const [userType, setUserType] = useState(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const needToBeLoggedIn = allowed_user_types.length > 0;

  useEffect(() => {
    const fetchUserType = async () => {
      if (currentUser) {
        const data = JSON.parse(currentUser.photoURL);
        setUserType(data['userType']);

        // Ensure allowed_user_types always includes "admin"
        const extendedAllowedUserTypes = [...new Set([...allowed_user_types, 'admin'])];

        // Check if any allowed type is present in the user type object
        console.log("userType: ", data['userType']);
        console.log("allowed_user_types: ", extendedAllowedUserTypes);
        if (Array.isArray(extendedAllowedUserTypes) && extendedAllowedUserTypes.some(type => data['userType'][type] === 1)) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
        console.log("isAllowed: ", isAllowed);
      } else {
        setIsAllowed(!needToBeLoggedIn);
      }
    };

    fetchUserType();
    console.log("user: ", currentUser);
  }, [currentUser, allowed_user_types, needToBeLoggedIn]);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0', margin: '0', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          {needToBeLoggedIn ? (
            userLoggedIn ? (
              userType ? (
                isAllowed ? (
                  <div style={{ padding: '20px' }}>{content}</div>
                ) : (
                  <Title level={2} style={{ marginTop: '20px' }}>אינך מורשה לגשת לדף זה.</Title>
                )
              ) : (
                <Title level={4}>בודק גישות...</Title>
              )
            ) : (
              <Title level={2} style={{ marginTop: '20px' }}>אינך מחובר. אנא התחבר כדי לגשת לדף זה.</Title>
            )
          ) : (
            <div style={{ padding: '20px' }}>{content}</div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default ProtectedPage;
