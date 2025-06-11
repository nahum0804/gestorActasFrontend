import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react'; // Importación específica para tipos
import { useNavigate, useParams } from 'react-router-dom';

interface NewPasswordFormProps {}

const NewPasswordForm: React.FC<NewPasswordFormProps> = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!newPassword || !confirmPassword) {
      setError('Debes ingresar y confirmar tu nueva contraseña.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }

      setMessage('Contraseña actualizada correctamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al restablecer tu contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Restablecer contraseña</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      <input type="hidden" value={token || ''} />

      <label className="block mb-2">
        <span className="text-gray-700">Nueva contraseña</span>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          required
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700">Confirmar nueva contraseña</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Repite tu contraseña"
          minLength={6}
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 text-white font-semibold rounded ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Actualizando...' : 'Actualizar contraseña'}
      </button>
    </form>
  );
};

export default NewPasswordForm;