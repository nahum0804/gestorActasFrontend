// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryCards from '../components/dashboard/SummaryCards'
import SessionsSection from '../components/dashboard/SesionSection'
import type { Session } from '../components/dashboard/SesionSection'
import MembersSection from '../components/dashboard/MembersSection'
import type { Member } from '../components/dashboard/MembersSection'
import SesionActiva from './SesionActiva'
import { useNotifications } from '../hooks/useNotifications'
import { BellIcon } from '@heroicons/react/24/outline'

interface DashboardProps {
  onLogout: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate()

  const token = localStorage.getItem('authToken') || ''

  const [pestana, setPestana] = useState<'Sesiones' | 'settings'>('Sesiones')
  const [view, setView] = useState<'menu' | 'Sesiones' | 'members' | 'sesion-activa' >('menu')

  const { notifs, unreadCount, markRead, remove } =
    useNotifications(token, !!token)

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

          <button
            onClick={() => setView('notificaciones')}
            className="relative p-2 hover:bg-gray-100 rounded-full"
          >
            <BellIcon className="h-6 w-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {pestana==='Sesiones' && (
            view==='notificaciones' ? (
              // ==== PANEL DE NOTIFICACIONES ====
              <div className="max-w-xl mx-auto space-y-4">
                <h2 className="text-xl font-bold mb-4">Notificaciones</h2>
                {notifs.length===0 ? (
                  <p className="text-gray-500">No tienes notificaciones.</p>
                ) : (
                  notifs.map(n => (
                    <div
                      key={n._id}
                      className={`p-4 border rounded flex justify-between items-start ${
                        n.leido ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{n.asunto}</p>
                        <p className="text-sm text-gray-700 mt-1">{n.contenido}</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        {!n.leido && (
                          <button
                            onClick={()=>markRead(n._id)}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Marcar leída
                          </button>
                        )}
                        <button
                          onClick={()=>remove(n._id)}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <button
                  onClick={()=>setView('menu')}
                  className="mt-6 text-gray-600 hover:underline"
                >
                  ← Volver
                </button>
              </div>
            ) : (
              // ==== PANEL DE SESIONES / MEMBERS / SESION ACTIVA ====
              <>
                {view==='menu' && (
                  <SummaryCards
                    totalSessions={sessions.length}
                    totalMembers={members.length}
                    onSessionsClick={()=>setView('Sesiones')}
                    onMembersClick={handleMembersClick}
                    onSesionActivaClick={()=>setView('sesion-activa')}
                  />
                )}

                {view==='Sesiones' && (
                  <SessionsSection
                    sessions={sessions}
                    onBack={()=>setView('menu')}
                    loading={loadingSessions}
                  />
                )}

                {view==='members' && (
                  loadingMembers
                    ? <p>Cargando miembros…</p>
                    : errorMembers
                      ? <p className="text-red-500">Error: {errorMembers}</p>
                      : <MembersSection members={members} onBack={()=>setView('menu')} />
                )}

                {view==='sesion-activa' && (
                  <SesionActiva onBack={()=>setView('menu')} />
                )}
              </>
            )
          )}

          {pestana==='settings' && (
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
