"use client";

import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button, Form, Input, Typography, Divider, Alert, Layout, Row, Col } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import { getUserType, getUserID } from './GetUserData.js';
import { getAuth, updateProfile } from "firebase/auth";
const auth = getAuth();

const { Title, Text } = Typography;
const { Content } = Layout;

const Login = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [photoUrlUpdated, setPhotoUrlUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const fetchUserType = async () => {
      setIsLoading(true);
      if (currentUser) {
        console.log(currentUser);
        try {
          let userID = '';

          if (currentUser.photoURL && isValidJSON(currentUser.photoURL)) {
            const allData = JSON.parse(currentUser.photoURL);
            if (allData.userID) {
              userID = allData.userID;
            } else {
              const id = await getUserID(currentUser.uid);
              userID = id.User_ID;
              allData.userID = userID;
              await updateProfile(auth.currentUser, {
                photoURL: JSON.stringify(allData),
              });
            }
          } else {
            const id = await getUserID(currentUser.uid);
            const typeRes = await getUserType(userID);
            const userType = typeRes.result;
            userID = id.User_ID;
            const allData = {
              userID: userID,
              userType: await userType
            };
            await updateProfile(auth.currentUser, {
              photoURL: JSON.stringify(allData),
            });
          }

          console.log("userID:", userID);
          const typeRes = await getUserType(userID);
          const userType = typeRes.result;
          const all_data = {
            'userType': userType,
            'userID': userID
          };
          console.log("userType:", userType);
          await updateProfile(auth.currentUser, {
            photoURL: JSON.stringify(all_data),
          });
          await auth.currentUser.reload();
          setPhotoUrlUpdated(true);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      } else {
        setPhotoUrlUpdated(true);
      }
      setIsLoading(false);
    };

    fetchUserType();
  }, [currentUser]);

  const onSubmit = async (e) => {
    setErrorMessage('');
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage('כתובת אימייל או סיסמה לא נכונים');
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = (e) => {
    setErrorMessage('');
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch(err => {
        setErrorMessage('אירעה שגיאה במהלך התחברות עם גוגל.');
        setIsSigningIn(false);
      });
    }
  };

  if (isLoading) {
    return (
      <Layout className="layout">
        <Content style={{ padding: '0 50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>מתחבר...</Title>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      {userLoggedIn && photoUrlUpdated && (<Navigate to={'/home'} replace={true} />)}
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0 }}>
        <Row justify="center" align="middle" style={{ minHeight: '60vh', width: '100%', margin: 0 }}>
          <Col xs={24} sm={16} md={12} lg={8} xl={6}>
            <div style={{ padding: '24px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
              <div className="text-center mb-4">
                <Title level={2}>ברוכים הבאים</Title>
              </div>
              {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
              <Form onFinish={onSubmit} layout="vertical">
                <Form.Item label="כתובת אימייל">
                  <Input
                    type="email"
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                  />
                </Form.Item>

                <Form.Item label="סיסמה">
                  <Input.Password
                    autoComplete='current-password'
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isSigningIn} block>
                    {isSigningIn ? 'מתחבר...' : 'התחבר'}
                  </Button>
                </Form.Item>
              </Form>
              <div className="text-center">
                <Text>אין לך חשבון? <Link to="/register">הירשם</Link></Text>
              </div>
              <Divider>או</Divider>
              <Button icon={<GoogleOutlined />} onClick={onGoogleSignIn} loading={isSigningIn} block>
                {isSigningIn ? 'מתחבר...' : 'התחבר עם גוגל'}
              </Button>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Login;
