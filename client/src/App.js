import { useEffect, useState } from "react";
import React from 'react';
import {
  Create,
  Dashboard,
  Landing,
  Login,
  Register,
  Status,
  Exam,
} from './containers';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Cookies from 'js-cookie';

const App = () => {
  const isAuthenticated = !!Cookies.get('token'); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-message">
        <h1>This application is only compatible with Desktop</h1>
        <p>Please open this application on a desktop or laptop for the best experience.</p>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            exact 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/exam" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Exam />} 
          />

          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/status" 
            element={isAuthenticated ? <Status /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create" 
            element={isAuthenticated ? <Create /> : <Navigate to="/login" />} 
          />

          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;