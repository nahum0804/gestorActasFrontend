
import React from 'react';
import NewPasswordForm from '../components/auth/NewPasswordForm';

const NewPasswordPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <NewPasswordForm />
      </div>
    </div>
  );
};

export default NewPasswordPage;