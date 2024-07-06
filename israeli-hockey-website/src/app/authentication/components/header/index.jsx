"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

const { Header } = Layout;

const CustomHeader = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  return (
    <Header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Menu theme="dark" mode="horizontal" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        {userLoggedIn ? (
          <Menu.Item key="logout">
            <a onClick={() => { doSignOut().then(() => { navigate('/login') }) }}>התנתק</a>
          </Menu.Item>
        ) : (
          <>
            <Menu.Item key="login">
              <Link to="/login">התחבר</Link>
            </Menu.Item>
            <Menu.Item key="register">
              <Link to="/register">צור חשבון חדש</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
}

export default CustomHeader;
