"use client";

import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button, Form, Input, Typography, Divider, Alert, Layout, Row, Col } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';

const { Title, Text } = Typography;
const { Content } = Layout;

const Login = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    // Any other client-side only code here
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
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
    e.preventDefault();
    setErrorMessage('');
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch(err => {
        setErrorMessage('אירעה שגיאה במהלך התחברות עם גוגל.');
        setIsSigningIn(false);
      });
    }
  };

  return (
    
    <Layout style={{ minHeight: '100vh', padding: 0, margin: 0 }}>
      {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0 }}>
        <Row justify="center" align="middle" style={{ minHeight: '100vh', width: '100%', margin: 0 }}>
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
