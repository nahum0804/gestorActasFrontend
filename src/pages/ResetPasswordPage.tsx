// src/pages/ResetPasswordPage.tsx
import React from 'react';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

interface ResetPasswordPageProps {}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;