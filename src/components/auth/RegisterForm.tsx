import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onRegisterSuccess: (fakeToken: string, userEmail: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 10_000);
    return () => clearTimeout(t);
  }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre || !email || !contrasena || !confirmContrasena) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (contrasena !== confirmContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          password: contrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      onRegisterSuccess(data.token, email);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Crear cuenta</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <label className="block mb-2">
        <span className="text-gray-700">Nombre completo</span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tu nombre"
        />
      </label>

      <label className="block mb-2">
        <span className="text-gray-700">Correo electrónico</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="ejemplo@dominio.com"
        />
      </label>

      <label className="block mb-2">
        <span className="text-gray-700">Contraseña</span>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="********"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700">Confirmar contraseña</span>
        <input
          type="password"
          value={confirmContrasena}
          onChange={(e) => setConfirmContrasena(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="********"
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
        {loading ? 'Registrando...' : 'Registrarme'}
      </button>
    </form>
  );
};

export default RegisterForm;
