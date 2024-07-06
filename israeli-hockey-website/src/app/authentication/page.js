"use client";

import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Header from './components/header';
import Home from './components/home';
import { AuthProvider } from './contexts/authContext';
import 'antd/dist/reset.css'; // Import Ant Design styles

function AppRoutes() {
  const routesArray = [
    {
      path: '*',
      element: <Login />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/home',
      element: <Home />,
    },
  ];

  let routesElement = useRoutes(routesArray);
  return <div style={{ padding: 0, margin: 0 }}>{routesElement}</div>;
}

function App() {
  return (
    <AuthProvider>
      <Header />
      <AppRoutes />
    </AuthProvider>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Root;
