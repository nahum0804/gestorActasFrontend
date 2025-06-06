import React from 'react';
import LoginForm from '../components/auth/LoginForm';

interface LoginPageProps {
  onLoginSuccess: (fakeToken: string, userEmail: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;