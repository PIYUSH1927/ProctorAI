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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    // ✅ Update state on window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ If screen width is less than 1024px, show mobile message
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
          {/* Public routes */}
          <Route exact path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/exam" element={<Exam />} />

          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/status" 
            element={Cookies.get('token') ? <Status /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create" 
            element={Cookies.get('token') ? <Create /> : <Navigate to="/login" />} 
          />

          {/* Catch-all route to redirect if no matching path */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
