// src/pages/CreateSessionPage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import BasicInfoSection from '../components/sesiones/BasicInfoSection'
import ConvocadosSection from '../components/sesiones/ConvocadosSection'
import AgendaSection from '../components/sesiones/AgendaSection'
import NotificationSection from '../components/sesiones/NotificationSection'

interface InfoData {
  tipo: 'ORDINARIA' | 'EXTRAORDINARIA'
  fecha: string
  hora: string
  modalidad: string
  plataforma?: string
  juntaDirectiva: string
  encargado: string
}

interface Invitado {
  nombre: string
  correo: string
}

interface AgendaPunto {
  titulo: string
  orden: number
  expositor: string
  tipo: 'informacion' | 'votacion'
}

type TabKey = 'info' | 'convocados' | 'agenda' | 'notificacion'

const CreateSessionPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('info')
  const [dirty, setDirty] = useState(false)
  const markDirty = useCallback(() => setDirty(true), [])

  const [infoData, setInfoData] = useState<InfoData>({
    tipo: 'ORDINARIA',
    fecha: '',
    hora: '',
    modalidad: 'Híbrida',
    plataforma: 'Zoom',
    juntaDirectiva: '',
    encargado: ''
  })

  const [invitados, setInvitados] = useState<Invitado[]>([])
  const [agendaDtos, setAgendaDtos] = useState<AgendaPunto[]>([])

  useEffect(() => {
    const fetchJuntaYEncargado = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/junta-directiva/miembros')
        const data = await res.json()
        const miembro = Array.isArray(data) ? data[0] : data.miembros?.[0]
        if (miembro && /^[a-f\d]{24}$/i.test(miembro._id)) {
          setInfoData(prev => ({
            ...prev,
            juntaDirectiva: miembro._id,
            encargado: miembro._id
          }))
        }
      } catch (err) {
        console.error('Error al cargar datos:', err)
      }
    }
    fetchJuntaYEncargado()
  }, [])

  const handleGuardar = async () => {
    const token = localStorage.getItem('token')
    const payload = {
      tipo: infoData.tipo,
      fecha: infoData.fecha,
      hora: infoData.hora,
      modalidad: infoData.modalidad,
      plataforma: infoData.plataforma,
      juntaDirectiva: infoData.juntaDirectiva,
      encargado: infoData.encargado,
      invitados,
      agendaDtos
    }

    console.log('Payload:', payload)

    try {
      const res = await fetch('http://localhost:3000/api/sesiones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error(await res.text())
      setDirty(false)
      navigate('/dashboard')
    } catch (err) {
      alert('Error al guardar sesión: ' + err)
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <button onClick={() => !dirty || window.confirm('Tienes cambios sin guardar. ¿Salir?') ? navigate(-1) : null} className="text-gray-600">← Volver</button>
        <h1 className="text-2xl font-semibold">Crear Nueva Sesión</h1>
        <div style={{ width: 60 }} />
      </header>

      <main className="flex-1 overflow-auto p-6 space-y-8">
        {activeTab === 'info' && (
          <BasicInfoSection
            data={infoData}
            onChange={setInfoData}
            markDirty={markDirty}
          />
        )}
        {activeTab === 'convocados' && (
          <ConvocadosSection
            data={invitados}
            onChange={setInvitados}
            markDirty={markDirty}
          />
        )}
        {activeTab === 'agenda' && (
          <AgendaSection
            data={agendaDtos}
            onChange={setAgendaDtos}
            markDirty={markDirty}
          />
        )}
        {activeTab === 'notificacion' && <NotificationSection markDirty={markDirty} />}

        <div className="text-right">
          <button
            onClick={handleGuardar}
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