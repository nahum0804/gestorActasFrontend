// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryCards from '../components/dashboard/SummaryCards'
import SessionsSection from '../components/dashboard/SesionSection'
import type { Session } from '../components/dashboard/SesionSection'
import MembersSection from '../components/dashboard/MembersSection'
import type { Member } from '../components/dashboard/MembersSection'
import SesionActiva from './SesionActiva'

interface DashboardProps {
  onLogout: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate()

  const [pestana, setPestana] = useState<'Sesiones' | 'settings'>('Sesiones')
  const [view, setView] = useState<'menu' | 'Sesiones' | 'members' | 'sesion-activa'>('menu')

  // --- SESIONES ---
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchSessions = async () => {
      setLoadingSessions(true)
      try {
        const res = await fetch('http://localhost:3000/api/sesiones', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (!res.ok) throw new Error('Error al cargar sesiones')
        const data = await res.json() as any[]
        setSessions(
          data.map(s => ({
            id: s._id,
            tipo: s.tipo,
            fechaHora: s.fechaHora,
            modalidad: s.modalidad,
            estado: s.estado
          }))
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingSessions(false)
      }
    }
    fetchSessions()
  }, [navigate])

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const handleCreateSession = () => {
    navigate('/crear-sesion')
  }

  // --- MIEMBROS ---
  const [members, setMembers] = useState<Member[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [errorMembers, setErrorMembers] = useState<string | null>(null)

  const handleMembersClick = async () => {
    setLoadingMembers(true)
    setErrorMembers(null)
    const token = localStorage.getItem('authToken')
    if (!token) {
      setErrorMembers('No estás autenticado')
      setLoadingMembers(false)
      return
    }
    try {
      const res = await fetch('http://localhost:3000/api/junta-directiva/miembros', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        cache: 'no-store'
      })
      if (!res.ok) throw new Error((await res.json()).message || res.statusText)
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Respuesta inválida')
      setMembers(data.map((u: any) => ({
        nombre: `${u.name} ${u.lastName}`.trim(),
        email: u.email,
        roles: u.roles || []
      })))
      setView('members')
    } catch (err: any) {
      setErrorMembers(err.message)
    } finally {
      setLoadingMembers(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r flex flex-col">
        <h2 className="text-xl font-semibold px-6 py-4 border-b">Menú</h2>
        <nav className="flex-1 px-2 py-4">
          <button
            onClick={() => { setPestana('Sesiones'); setView('menu') }}
            className={`w-full px-4 py-2 mb-1 text-left rounded ${
              pestana === 'Sesiones'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sesiones
          </button>
          <button
            onClick={() => setPestana('settings')}
            className={`w-full px-4 py-2 text-left rounded ${
              pestana === 'settings'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Settings
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="m-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header con botón Crear Sesión */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4">
          <h1 className="text-2xl font-semibold">Gestor de Sesiones</h1>
          <button
            onClick={handleCreateSession}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Crear Sesión
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {pestana === 'Sesiones' && (
            <>
              {view === 'menu' && (
                <SummaryCards
                  totalSessions={sessions.length}
                  totalMembers={members.length}
                  onSessionsClick={() => setView('Sesiones')}
                  onMembersClick={handleMembersClick}
                  onSesionActivaClick={() => setView('sesion-activa')}
                />
              )}

              {view === 'Sesiones' && (
                <SessionsSection
                  sessions={sessions}
                  onBack={() => setView('menu')}
                  loading={loadingSessions}
                />
              )}

              {view === 'members' && (
                loadingMembers
                  ? <p>Cargando miembros…</p>
                  : errorMembers
                    ? <p className="text-red-500">Error: {errorMembers}</p>
                    : <MembersSection members={members} onBack={() => setView('menu')} />
              )}

              {view === 'sesion-activa' && (
                <SesionActiva onBack={() => setView('menu')} />
              )}
            </>
          )}

          {pestana === 'settings' && (
            <section className="p-6">
              <h2 className="text-xl font-medium mb-2">Settings</h2>
              <p className="text-gray-600">Configura tu perfil, notificaciones, etc.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
