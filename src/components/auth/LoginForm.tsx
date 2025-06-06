import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLoginSuccess: (fakeToken: string, userEmail: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 10_000);
    return () => clearTimeout(t);
  }, [error]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !contrasena) {
      setError('Debes llenar email y contraseña.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (contrasena === '123') {
        setLoading(false);
        setError('Contraseña muy débil. Usa otra cosa.');
        return;
      }

      const fakeToken = 'token_falso_456';
      const userEmail = email;

      onLoginSuccess(fakeToken, userEmail);

      navigate('/dashboard');
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Iniciar sesión</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

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

      <label className="block mb-4">
        <span className="text-gray-700">Contraseña</span>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
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
        {loading ? 'Validando...' : 'Entrar'}
      </button>

      <div className='mt-6 flex place-content-between'> 
        <p className="mt-4 text-sm text-gray-600">
          <a
            href="/register"
            className="text-blue-600 hover:underline"
          >
            Regístrate aquí
          </a>
        </p>

        <p className="mt-4 text-sm text-gray-600">
          <a
            href="/reset-password"
            className="text-blue-600 hover:underline"
          >
            Restablece tu contraseña
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;