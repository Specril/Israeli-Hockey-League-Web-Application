"use client";

import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Typography, Alert, Layout, Row, Col } from 'antd';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

const { Title, Text } = Typography;
const { Content } = Layout;

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { userLoggedIn, setCurrentUser } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const user = await doCreateUserWithEmailAndPassword(email, name, password);
        const unsubscribe = onAuthStateChanged(auth, (updatedUser) => {
          if (updatedUser && updatedUser.displayName === name) {
            setCurrentUser(updatedUser);
            navigate('/home');
            unsubscribe();
          }
        });
      } catch (error) {
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', padding: 0, margin: 0 }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0 }}>
        <Row justify="center" align="middle" style={{ minHeight: '100vh', width: '100%', margin: 0 }}>
          <Col xs={24} sm={16} md={12} lg={8} xl={6}>
            <div style={{ padding: '24px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
              <div className="text-center mb-4">
                <Title level={2}>צור חשבון חדש</Title>
              </div>
              {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
              <Form onFinish={onSubmit} layout="vertical">
                <Form.Item label="כתובת אימייל">
                  <Input
                    type="email"
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="שם">
                  <Input
                    type="text"
                    autoComplete='name'
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="סיסמה">
                  <Input.Password
                    disabled={isRegistering}
                    autoComplete='new-password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="אימות סיסמה">
                  <Input.Password
                    disabled={isRegistering}
                    autoComplete='off'
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isRegistering} block>
                    {isRegistering ? 'נרשם...' : 'הירשם'}
                  </Button>
                </Form.Item>
              </Form>
              <div className="text-center">
                <Text>כבר יש לך חשבון? <Link to="/login">התחבר</Link></Text>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Register;
