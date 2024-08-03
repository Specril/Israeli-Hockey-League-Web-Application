"use client";

import { React, useState, useEffect } from 'react';
import { HashRouter, useRoutes } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Header from './components/header';
import Home from './components/home';
import { AuthProvider } from './contexts/authContext';
import 'antd/dist/reset.css'; // Import Ant Design styles

function AppRoutes() {
  const routes = [
    { path : '/', element: <Login />},
    { path: '*', element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/home', element: <Home /> },
  ];

  return useRoutes(routes);
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true after component mounts to ensure client-side rendering
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Optionally, render a loading indicator or null while waiting for client-side rendering
    return null;
  }

  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

export default Root;
