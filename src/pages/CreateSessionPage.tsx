// src/pages/CreateSessionPage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import BasicInfoSection from '../components/sesiones/BasicInfoSection'
import ConvocadosSection from '../components/sesiones/ConvocadosSection'
import AgendaSection from '../components/sesiones/AgendaSection'
import NotificationSection from '../components/sesiones/NotificationSection'

type TabKey = 'info' | 'convocados' | 'agenda'| 'notificacion'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'info',         label: 'Información Básica' },
  { key: 'convocados',   label: 'Convocados'       },
  { key: 'agenda',       label: 'Puntos de Agenda' },
  { key: 'notificacion', label: 'Notificación'     },
]

const CreateSessionPage: React.FC = () => {
  const navigate = useNavigate()

  // 1) flag de cambios
  const [dirty, setDirty] = useState(false)
  const markDirty = useCallback(() => setDirty(true), [])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const handleBack = useCallback(() => {
    if (!dirty || window.confirm('Tienes cambios sin guardar. Al salir, se perderán. ¿Continuar?')) {
      navigate(-1)
    }
  }, [dirty, navigate])

  const [activeTab, setActiveTab] = useState<TabKey>('info')

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800 px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-semibold">Crear Nueva Sesión</h1>
        <div style={{ width: 60 }} /> {/* espacio */}
      </header>

      <nav className="bg-white border-b px-6">
        <ul className="flex justify-center space-x-4">
          {TABS.map(({ key, label }) => (
            <li key={key}>
              <button
                onClick={() => setActiveTab(key)}
                className={`px-3 py-4 text-sm font-medium ${
                  activeTab === key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 overflow-auto p-6 space-y-8">
        {activeTab === 'info'        && <BasicInfoSection    markDirty={markDirty} />}
        {activeTab === 'convocados'  && <ConvocadosSection  markDirty={markDirty} />}
        {activeTab === 'agenda'      && <AgendaSection      markDirty={markDirty} />}
        {activeTab === 'notificacion'&& <NotificationSection markDirty={markDirty} />}

        <div className="text-right">
          <button
            onClick={() => {
              // TODO: llamar a la API para guardar
              setDirty(false)
              navigate('/dashboard')
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Guardar Sesión
          </button>
        </div>
      </main>
    </div>
  )
}

export default CreateSessionPage
