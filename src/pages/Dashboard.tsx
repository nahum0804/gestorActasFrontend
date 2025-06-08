// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SummaryCards from '../components/dashboard/SummaryCards'
import ActasSection from '../components/dashboard/ActasSection'
import type { Acta } from '../components/dashboard/ActasSection'
import MembersSection from '../components/dashboard/MembersSection'
import type { Member } from '../components/dashboard/MembersSection'

interface DashboardProps {
  onLogout: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate()

  // pestaña del sidebar: 'Sesiones' o 'settings'
  const [pestana, setPestana] = useState<'Sesiones' | 'settings'>('Sesiones')
  // vista interna dentro de 'Sesiones': 'menu', 'Sesiones' o 'members'
  const [view, setView] = useState<'menu' | 'Sesiones' | 'members'>('menu')

  // datos de ejemplo
  const [actas] = useState<Acta[]>([
    { id: 1, fechaCreacion: '2025-05-28', creador: 'Juan Pérez' },
    { id: 2, fechaCreacion: '2025-05-30', creador: 'María Gómez' },
    { id: 3, fechaCreacion: '2025-06-01', creador: 'Carlos Vargas' },
  ])
  const [members] = useState<Member[]>([
    { nombre: 'Marlon Vargas Alvarado', email: 'mvargas@example.com' },
    { nombre: 'Jose Altamirano Rivera',  email: 'jaltamirano@example.com' },
    { nombre: 'Anthony Quesada Alfaro',   email: 'aquesada@example.com' },
  ])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const handleCerrarSesion = () => {
    onLogout()
    navigate('/login')
  }
  const handleCrearSesion = () => navigate('/crear-sesion')

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
            onClick={() => { setPestana('settings') /* no cambiamos view aquí */ }}
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
          <button
            onClick={handleCrearSesion}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Crear Sesión
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {pestana === 'Sesiones' && (
            <>
              {/* menú inicial de tarjetas */}
              {view === 'menu' && (
                <SummaryCards
                  totalSessions={actas.length}
                  totalMembers={members.length}
                  onSessionsClick={() => setView('Sesiones')}
                  onMembersClick={() => setView('members')}
                />
              )}

              {/* listado de actas encapsulado */}
              {view === 'Sesiones' && (
                <ActasSection
                  actas={actas}
                  onBack={() => setView('menu')}
                />
              )}

              {/* listado de miembros encapsulado */}
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
  )
}

export default Dashboard
