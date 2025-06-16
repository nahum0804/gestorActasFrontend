// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryCards from '../components/dashboard/SummaryCards'
import ActasSection from '../components/dashboard/ActasSection'
import MembersSection from '../components/dashboard/MembersSection'
import type { Member } from '../components/dashboard/MembersSection'
import type { Acta } from '../interfaces/acta'
import SesionActiva from './SesionActiva'

interface DashboardProps {
  onLogout: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate()

  const [pestana, setPestana] = useState<'Sesiones'|'settings'>('Sesiones')
  const [view, setView] = useState<'menu'|'Sesiones'|'members'|'sesion-activa'>('menu')

  const [actas, setActas] = useState<Acta[]>([])
  const [loadingActas, setLoadingActas] = useState(true)

  const [members, setMembers] = useState<Member[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [errorMembers, setErrorMembers] = useState<string|null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchActas = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/actas', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) throw new Error('Error al cargar actas')

        const data: Acta[] = await res.json()
        setActas(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingActas(false)
      }
    }

    fetchActas()
  }, [navigate])

  const handleCerrarSesion = () => {
    onLogout()
    navigate('/login')
  }

  const handleCrearSesion = () => {
    navigate('/crear-sesion')
  }

  const handleCreateActa = async () => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    try {
      const res = await fetch('http://localhost:3000/api/actas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: 'Nueva Acta',
          fechaSesion: new Date().toISOString().split('T')[0],
          contenido: ''
        })
      })

      if (!res.ok) throw new Error('Error al crear acta')

      const newActa: Acta = await res.json()
      setActas([...actas, newActa])
      navigate(`/editar-acta/${newActa.id}`)
    } catch (err) {
      console.error(err)
    }
  }

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
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? res.statusText)
      }

      const data = await res.json()
      console.log('Miembros desde API:', data)

      if (!Array.isArray(data)) {
        console.warn('La respuesta de miembros no es un array:', data)
        setErrorMembers('Respuesta inválida del servidor')
        return
      }

      setMembers(
        data.map((u: any) => ({
          nombre: `${u.name ?? u.nombre ?? 'SinNombre'} ${u.lastName ?? ''}`,
          email: u.email ?? u.correo ?? 'sin-email@ejemplo.com',
        }))
      )
      setView('members')
    } catch (err: any) {
      console.error(err)
      setErrorMembers(err.message || 'Error al cargar miembros')
    } finally {
      setLoadingMembers(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
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
            onClick={() => setPestana('settings')}
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
                  onMembersClick={handleMembersClick}
                  onSesionActivaClick={() => setView('sesion-activa')}
                />
              )}

              {view === 'Sesiones' && (
                <ActasSection
                  actas={actas}
                  onBack={() => setView('menu')}
                  onDownloadPdf={async (id) => {/* PDF logic */}}
                  loading={loadingActas}
                />
              )}

              {view === 'members' && (
                loadingMembers ? (
                  <p>Cargando miembros de la junta…</p>
                ) : errorMembers ? (
                  <p className="text-red-500">Error: {errorMembers}</p>
                ) : (
                  <MembersSection
                    members={members}
                    onBack={() => setView('menu')}
                  />
                )
              )}

              {view === 'sesion-activa' && (
                <SesionActiva onBack={() => setView('menu')} />
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