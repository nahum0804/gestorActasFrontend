import React from 'react'
import ResetPasswordForm from '../components/auth/ResetPasswordForm'

const ResetPasswordPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <div className="w-full max-w-md">
      <ResetPasswordForm />
    </div>
  </div>
)

export default ResetPasswordPage