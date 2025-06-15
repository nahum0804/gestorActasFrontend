// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryCards from '../components/dashboard/SummaryCards'
import ActasSection from '../components/dashboard/ActasSection'
import MembersSection from '../components/dashboard/MembersSection'
import type { Member } from '../components/dashboard/MembersSection'
import type { Acta, CreateActaDto } from '../interfaces/acta'

interface DashboardProps {
  onLogout: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate()

  // Pestañas y vistas
  const [pestana, setPestana] = useState<'Sesiones'|'settings'>('Sesiones')
  const [view, setView]     = useState<'menu'|'Sesiones'|'members'>('menu')

  // Actas (simulado)
  const [actas, setActas]       = useState<Acta[]>([])
  const [loadingActas, setLoadingActas] = useState(true)

  // Miembros (reales desde API)
  const [members, setMembers]           = useState<Member[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [errorMembers, setErrorMembers]     = useState<string|null>(null)

  // Al montar, revisa token y carga actas
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
      return
    }

    // mockActaApi
    const fetchActas = async () => {
      try {
        const data = await mockActaApi.getActas()
        setActas(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingActas(false)
      }
    }
    fetchActas()
  }, [navigate])

  // Handlers de botones
  const handleCerrarSesion = () => {
    onLogout()
    navigate('/login')
  }
  const handleCrearSesion = () => {
    navigate('/crear-sesion')
  }
  const handleCreateActa = async () => {
    const newActa = await mockActaApi.createActa({
      titulo: 'Nueva Acta',
      fechaSesion: new Date().toISOString().split('T')[0],
      contenido: '',
    })
    setActas([...actas, newActa])
    navigate(`/editar-acta/${newActa.id}`)
  }

  // --- NUEVO: traer miembros al hacer click ---
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? res.statusText)
      }
      const data: Array<{
        _id: string
        name: string
        lastName: string
        email: string
      }> = await res.json()

      
      setMembers(
        data.map(u => ({
          nombre: `${u.name} ${u.lastName}`,
          email: u.email,
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
                  onMembersClick={handleMembersClick}   // ← aquí
                />
              )}

              {view === 'Sesiones' && (
                <ActasSection
                  actas={actas}
                  onBack={() => setView('menu')}
                  onDownloadPdf={async (id) => {
                    /* tu lógica para descargar */
                  }}
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
