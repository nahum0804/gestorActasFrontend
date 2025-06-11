import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar contraseña');
      }

      setSuccess('Contraseña actualizada correctamente');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Contraseña Actual</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Nueva Contraseña</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          minLength={6}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
      >
        Actualizar Contraseña
      </button>
    </form>
  );
};

  export default ChangePasswordForm;