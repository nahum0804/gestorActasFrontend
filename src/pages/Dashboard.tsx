import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCards from '../components/dashboard/SummaryCards';
import ActasSection from '../components/dashboard/ActasSection';
import MembersSection from '../components/dashboard/MembersSection';
import type { Member } from '../components/dashboard/MembersSection';
import type { Acta, CreateActaDto } from '../interfaces/acta';

interface DashboardProps {
  onLogout: () => void;
}

// Simulación de API
const mockActaApi = {
  getActas: async (): Promise<Acta[]> => {
    return [
      { 
        id: 1, 
        codigo: 'SO-05-2025', 
        titulo: 'Sesión Ordinaria Mayo 2025', 
        fechaCreacion: '2025-05-28', 
        fechaSesion: '2025-05-28',
        creador: 'Juan Pérez', 
        estado: 'cerrada',
        contenido: 'Contenido del acta...',
        pdfUrl: '/actas/SO-05-2025.pdf'
      },
      { 
        id: 2, 
        codigo: 'SO-06-2025', 
        titulo: 'Sesión Ordinaria Junio 2025', 
        fechaCreacion: '2025-06-01', 
        fechaSesion: '2025-06-05',
        creador: 'María Gómez', 
        estado: 'pendiente',
        contenido: 'Contenido pendiente...'
      },
      { 
        id: 3, 
        codigo: 'EX-01-2025', 
        titulo: 'Sesión Extraordinaria', 
        fechaCreacion: '2025-06-10', 
        fechaSesion: '2025-06-15',
        creador: 'Carlos Vargas', 
        estado: 'borrador',
        contenido: 'Borrador del acta...'
      }
    ];
  },
  createActa: async (data: CreateActaDto): Promise<Acta> => {
    return { 
      ...data, 
      id: Date.now(), 
      codigo: `SO-${new Date().getMonth()+1}-${new Date().getFullYear()}`, 
      fechaCreacion: new Date().toISOString(), 
      creador: 'Usuario Actual', 
      estado: 'borrador',
      pdfUrl: undefined
    };
  },
  generatePdf: async (actaId: number): Promise<string> => {
    return `/actas/acta-${actaId}.pdf`;
  }
};

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [pestana, setPestana] = useState<'Sesiones' | 'settings'>('Sesiones');
  const [view, setView] = useState<'menu' | 'Sesiones' | 'members'>('menu');
  const [actas, setActas] = useState<Acta[]>([]);
  const [loading, setLoading] = useState(true);
  const [members] = useState<Member[]>([
    { nombre: 'Marlon Vargas Alvarado', email: 'mvargas@example.com' },
    { nombre: 'Jose Altamirano Rivera',  email: 'jaltamirano@example.com' },
    { nombre: 'Anthony Quesada Alfaro',   email: 'aquesada@example.com' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchActas = async () => {
      try {
        const data = await mockActaApi.getActas();
        setActas(data);
      } catch (error) {
        console.error('Error fetching actas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActas();
  }, []);

  const handleCerrarSesion = () => {
    onLogout();
    navigate('/login');
  };

  const handleCrearSesion = () => navigate('/crear-sesion');

  const handleCreateActa = async () => {
    const newActa = await mockActaApi.createActa({
      titulo: 'Nueva Acta',
      fechaSesion: new Date().toISOString().split('T')[0],
      contenido: ''
    });
    setActas([...actas, newActa]);
    navigate(`/editar-acta/${newActa.id}`);
  };

  const handleDownloadPdf = async (actaId: number) => {
    try {
      const pdfUrl = await mockActaApi.generatePdf(actaId);
      // Simular descarga
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `acta-${actaId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('No se pudo generar el PDF');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <h2 className="text-xl font-semibold px-6 py-4 border-b border-gray-200">Menú</h2>
        <nav className="flex-1 px-2 py-4">
          <button
            onClick={() => { setPestana('Sesiones'); setView('menu') }}
            className={`w-full text-left px-4 py-2 rounded-md mb-1 ${
              pestana === 'Sesiones'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sesiones
          </button>
          <button
            onClick={() => { setPestana('settings') }}
            className={`w-full text-left px-4 py-2 rounded-md mt-1 ${
              pestana === 'settings'
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          <h1 className="text-2xl font-semibold">Gestor de Sesiones</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleCreateActa}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Crear Acta
            </button>
            <button
              onClick={handleCrearSesion}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Crear Sesión
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {pestana === 'Sesiones' && (
            <>
              {view === 'menu' && (
                <SummaryCards
                  totalSessions={actas.length}
                  totalMembers={members.length}
                  onSessionsClick={() => setView('Sesiones')}
                  onMembersClick={() => setView('members')}
                />
              )}

              {view === 'Sesiones' && (
                <ActasSection
                  actas={actas}
                  onBack={() => setView('menu')}
                  onDownloadPdf={handleDownloadPdf}
                  loading={loading}
                />
              )}

              {view === 'members' && (
                <MembersSection
                  members={members}
                  onBack={() => setView('menu')}
                />
              )}
            </>
          )}

          {pestana === 'settings' && (
            <section>
              <h2 className="text-xl font-medium mb-4">Settings</h2>
              <p className="text-gray-600">Configura tu perfil, notificaciones, etc.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;