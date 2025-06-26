import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateSessionPage from './pages/CreateSessionPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';
import ChangePasswordForm from './components/auth/ChangePasswordForm';
import ProfileForm from './components/auth/ProfileForm';

type UserRole = 'ADMINISTRADOR' | 'EDITOR' | 'VISOR';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const roles = localStorage.getItem('userRoles');

    setIsAuthenticated(!!token);

    if (roles) {
      try {
        setUserRoles(JSON.parse(roles) as UserRole[]);
      } catch {
        setUserRoles([]);
      }
    }
  }, []);

  // Guardar token y roles después del login exitoso
  const handleLoginSuccess = (token: string, userEmail: string, roles: UserRole[] = ['ADMINISTRADOR']) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userRoles', JSON.stringify(roles));
    setIsAuthenticated(true);
    setUserRoles(roles);
  };

  // Cerrar sesión y limpiar storage
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');
    setIsAuthenticated(false);
    setUserRoles([]);
  };

  // Ruta protegida con verificación opcional de roles
  const ProtectedRoute: React.FC<{
    children: React.ReactNode;
    requiredRoles?: UserRole[];
    redirectTo?: string;
  }> = ({ children, requiredRoles, redirectTo = '/dashboard' }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
      return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
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
          path="/reset-password/:token"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <NewPasswordPage />
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crear-sesion"
          element={
            <ProtectedRoute requiredRoles={['ADMINISTRADOR', 'EDITOR', 'VISOR']}>
              <CreateSessionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordForm />
            </ProtectedRoute>
          }
        />

        {/* Ruta comodín */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;