import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateSessionPage from './pages/CreateSessionPage';
import ResetPasswordPage from './pages/ResetPasswordPage';  

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = (fakeToken: string, userEmail: string) => {
    localStorage.setItem('authToken', fakeToken);
    localStorage.setItem('userEmail', userEmail);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <RegisterPage onRegisterSuccess={handleLoginSuccess} />
          }
        />

        <Route
          path="/reset-password"              
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />  
              : <ResetPasswordPage />
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated
              ? <Dashboard onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />

        <Route 
          path="/crear-sesion"
          element={
            isAuthenticated
              ? <CreateSessionPage />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
