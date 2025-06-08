import React, { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface ResetPasswordFormProps {}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(null), 6000)
    return () => clearTimeout(t)
  }, [error])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!email) {
      setError('Debes ingresar tu correo electrónico.')
      return
    }
    setLoading(true)
    // simulación de petición
    setTimeout(() => {
      setLoading(false)
      setMessage('Si existe tu cuenta, recibirás un enlace para restablecer la contraseña.')
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Olvidé mi contraseña</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{message}</div>}

      <label className="block mb-4">
        <span className="text-gray-700">Correo electrónico</span>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="tu@ejemplo.com"
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
        {loading ? 'Enviando...' : 'Enviar enlace'}
      </button>

      <p className="mt-6 text-center text-sm text-gray-600">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:underline"
        >
          Regresar al inicio de sesión
        </button>
      </p>
    </form>
  )
}

export default ResetPasswordForm