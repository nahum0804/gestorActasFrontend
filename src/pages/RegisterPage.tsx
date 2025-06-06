import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

interface RegisterPageProps {
  onRegisterSuccess: (fakeToken: string, userEmail: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <RegisterForm onRegisterSuccess={onRegisterSuccess} />
      </div>
    </div>
  );
};

export default RegisterPage;