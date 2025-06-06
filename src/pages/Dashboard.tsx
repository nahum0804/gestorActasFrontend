// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  onLogout: () => void;
}

type Acta = {
  id: number;
  fechaCreacion: string;
  creador: string;
};

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [emailUsuario, setEmailUsuario] = useState<string | null>(null);

  const [pestañaActiva, setPestañaActiva] = useState<'actas' | 'settings'>('actas');

  // Datos quemados de ejemplo para las actas
  const [actas] = useState<Acta[]>([
    { id: 1, fechaCreacion: '2025-05-28', creador: 'Juan Pérez' },
    { id: 2, fechaCreacion: '2025-05-30', creador: 'María Gómez' },
    { id: 3, fechaCreacion: '2025-06-01', creador: 'Carlos Vargas' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const email = localStorage.getItem('userEmail');
    setEmailUsuario(email);
  }, [navigate]);

  const handleCerrarSesion = () => {
    onLogout();
    navigate('/login');
  };

  const handleCrearSesion = () => {
    alert('Aquí iría la lógica para “Crear Sesión”');
  };

  return (
    <div className="flex h-screen bg-gray-100">

      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <h2 className="text-xl font-semibold px-6 py-4 border-b border-gray-200">
          Menú
        </h2>

        <nav className="flex-1 px-2 py-4">
          <button
            onClick={() => setPestañaActiva('actas')}
            className={`w-full text-left px-4 py-2 rounded-md mb-1 ${
              pestañaActiva === 'actas'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Actas
          </button>
          <button
            onClick={() => setPestañaActiva('settings')}
            className={`w-full text-left px-4 py-2 rounded-md mt-1 ${
              pestañaActiva === 'settings'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Settings
          </button>
        </nav>

        <button
          onClick={handleCerrarSesion}
          className="m-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Cerrar sesión
        </button>
      </aside>

    
      <div className="flex-1 flex flex-col">

        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          <h1 className="text-2xl font-semibold">Gestor de Sesiones</h1>
          <button
            onClick={handleCrearSesion}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Crear Sesión
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {pestañaActiva === 'actas' ? (
            // === Vista “Actas” ===
            <section>
              <h2 className="text-xl font-medium mb-4">Actas creadas</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fecha de creación</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Creador</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actas.map((acta) => (
                      <tr key={acta.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{acta.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{acta.fechaCreacion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{acta.creador}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {/* Botón de “Descargar PDF” (sin funcionalidad) */}
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          >
                            Descargar PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                    {actas.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No hay actas creadas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            // === Vista “Settings” ===
            <section>
              <h2 className="text-xl font-medium mb-4">Settings</h2>
              <p className="text-gray-700">
                Aquí irían las opciones de configuración de tu aplicación. Por ejemplo:
              </p>
              <ul className="list-disc list-inside mt-3 text-gray-600">
                <li>Cambiar contraseña</li>
                <li>Editar perfil</li>
                <li>Preferencias de notificaciones</li>
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
