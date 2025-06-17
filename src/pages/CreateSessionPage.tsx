import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type TabKey = 'info' | 'asistentes' | 'agenda' | 'notificacion'

interface InfoData {
  tipo: 'ORDINARIA' | 'EXTRAORDINARIA'
  fecha: string
  hora: string
  modalidad: string
  plataforma?: string | null
  ubicacion: string
  juntaDirectiva: string
  encargado: string
}

interface Invitado {
  nombre: string
  correo: string
}

type PuntoTipo = 'informacion' | 'votacion'
interface AgendaPunto {
  titulo: string
  orden: number
  expositor: string
  tipo: PuntoTipo
  duracion: number
}

const CreateSessionPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('info')

  const userId = localStorage.getItem('userId') || ''
  const [infoData, setInfoData] = useState<InfoData>({
    tipo: 'ORDINARIA',
    fecha: '',
    hora: '',
    modalidad: 'Híbrida',
    plataforma: 'Zoom',
    ubicacion: '',
    juntaDirectiva: '',
    encargado: userId
  })

  const [invitados, setInvitados] = useState<Invitado[]>([])
  const [agendaDtos, setAgendaDtos] = useState<AgendaPunto[]>([])
  const [juntaMiembros, setJuntaMiembros] = useState<Array<{ _id: string; name: string; lastName: string }>>([])
  const [notificationMessage, setNotificationMessage] = useState<string>('')

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    // decodificar token para obtener encargado
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        const sub = payload.sub || payload.userId || ''
        setInfoData(f => ({ ...f, encargado: sub }))
      }
    } catch {
      console.warn('No se pudo decodificar el token')
    }

    // cargar junta directiva
    fetch('http://localhost:3000/api/junta-directiva', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        setInfoData(f => ({ ...f, juntaDirectiva: data.id }))
        setJuntaMiembros(data.miembrosData || [])
      })
      .catch(err => console.error('Error cargando junta:', err))
  }, [])

  const handleInfoChange = (field: keyof InfoData, value: any) => {
    setInfoData(f => ({
      ...f,
      [field]: value,
      ...(field === 'modalidad' && value === 'Presencial' ? { plataforma: null } : {})
    }))
  }

  const addInvitado = (nombre: string, correo: string) => {
    if (!nombre || !correo) return
    setInvitados(curr => [...curr, { nombre, correo }])
  }

  const removeInvitado = (idx: number) => {
    setInvitados(curr => curr.filter((_, i) => i !== idx))
  }

  const addAgendaItem = () => {
    setAgendaDtos(curr => [
      ...curr,
      { titulo: '', orden: curr.length + 1, expositor: '', tipo: 'informacion', duracion: 0 }
    ])
  }

  const updateAgendaItem = (idx: number, field: keyof AgendaPunto, value: any) => {
    setAgendaDtos(curr => {
      const list = [...curr]
      list[idx] = {
        ...list[idx],
        [field]: field === 'orden' ? Number(value) : value
      }
      return list
    })
  }

  const programarAgenda = async () => {
    if (invitados.length === 0) {
      alert('Debes agregar al menos un invitado para programar la sesión.')
      setActiveTab('asistentes')
      return
    }
    if (agendaDtos.length === 0) {
      alert('Debes agregar al menos un punto de agenda.')
      setActiveTab('agenda')
      return
    }
    const token = localStorage.getItem('authToken')
    if (!token) {
      alert('No autenticado')
      return
    }

    // construimos solo las propiedades que el backend acepta
    const payload = {
      tipo: infoData.tipo,
      fecha: infoData.fecha,
      hora: infoData.hora,
      modalidad: infoData.modalidad,
      juntaDirectiva: infoData.juntaDirectiva,
      encargado: infoData.encargado,
      invitados: invitados.map(inv => ({ nombre: inv.nombre, correo: inv.correo })),
      agendaDtos: agendaDtos.map(item => ({
        titulo: item.titulo,
        orden: item.orden,
        expositor: item.expositor,
        tipo: item.tipo
      }))
    }

    console.log('Payload a enviar:', payload)

    try {
      const res = await fetch('http://localhost:3000/api/sesiones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errorBody = await res.json().catch(() => null)
        throw new Error(errorBody?.message || res.statusText)
      }
      navigate('/dashboard')
    } catch (err: any) {
      alert('Error al guardar sesión: ' + err.message)
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <button onClick={() => navigate(-1)} className="text-gray-600">← Volver</button>
        <h1 className="text-2xl font-semibold">Crear Nueva Sesión</h1>
        <div style={{ width: 60 }} />
      </header>

      <nav className="flex border-b bg-white">
        {(['info', 'asistentes', 'agenda', 'notificacion'] as TabKey[]).map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {{
              info: 'Información Básica',
              asistentes: 'Invitados',
              agenda: 'Puntos de Agenda',
              notificacion: 'Notificación'
            }[key]}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-auto p-6">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Información básica */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Tipo</label>
                <select
                  value={infoData.tipo}
                  onChange={e => handleInfoChange('tipo', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option value="ORDINARIA">ORDINARIA</option>
                  <option value="EXTRAORDINARIA">EXTRAORDINARIA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Modalidad</label>
                <select
                  value={infoData.modalidad}
                  onChange={e => handleInfoChange('modalidad', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option>Híbrida</option>
                  <option>Presencial</option>
                  <option>Virtual</option>
                </select>
              </div>
            </div>

            {/* Fecha / Hora / Ubicación */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  value={infoData.fecha}
                  onChange={e => handleInfoChange('fecha', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Hora</label>
                <input
                  type="time"
                  value={infoData.hora}
                  onChange={e => handleInfoChange('hora', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Ubicación</label>
                <input
                  type="text"
                  value={infoData.ubicacion}
                  onChange={e => handleInfoChange('ubicacion', e.target.value)}
                  placeholder="Salón 101, ..."
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Plataforma solo para Virtual/Híbrida */}
            {(infoData.modalidad === 'Virtual' || infoData.modalidad === 'Híbrida') && (
              <div>
                <label className="block text-sm font-medium">Plataforma</label>
                <select
                  value={infoData.plataforma || ''}
                  onChange={e => handleInfoChange('plataforma', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option value="">-- Seleccione --</option>
                  {['Zoom', 'Google Meet', 'Teams'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {activeTab === 'asistentes' && (
          <div className="space-y-4">
            {/* Lista de invitados */}
            {invitados.map((inv, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <span>{inv.nombre} ({inv.correo})</span>
                <button onClick={() => removeInvitado(idx)} className="text-red-500 hover:underline">
                  Eliminar
                </button>
              </div>
            ))}

            {/* Formulario agregar invitado */}
            <div className="grid grid-cols-2 gap-4">
              <input id="nombreInv" placeholder="Nombre" className="border rounded px-3 py-2" />
              <input id="correoInv" placeholder="correo@ejemplo.com" className="border rounded px-3 py-2" />
            </div>
            <button
              onClick={() => {
                const nom = (document.getElementById('nombreInv') as HTMLInputElement).value
                const cor = (document.getElementById('correoInv') as HTMLInputElement).value
                addInvitado(nom, cor)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              + Agregar Invitado
            </button>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="space-y-6">
            {/* Lista de puntos de agenda */}
            {agendaDtos.map((item, idx) => (
              <div key={idx} className="border p-4 rounded-lg space-y-3">
                <div className="flex items-center space-x-4">
                  {/* Orden */}
                  <label className="flex items-center space-x-2">
                    <span className="text-sm">Orden:</span>
                    <input
                      type="number"
                      value={item.orden}
                      onChange={e => updateAgendaItem(idx, 'orden', e.target.value)}
                      className="w-16 border rounded px-2 py-1 ml-2"
                      placeholder="Orden"
                    />
                  </label>
                  {/* Título */}
                  <label className="flex-1 flex items-center space-x-2">
                    <span className="text-sm">Título:</span>
                    <input
                      type="text"
                      value={item.titulo}
                      onChange={e => updateAgendaItem(idx, 'titulo', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Título"
                    />
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Tipo */}
                  <select
                    value={item.tipo}
                    onChange={e => updateAgendaItem(idx, 'tipo', e.target.value)}
                    className="border rounded px-3 py-2 ml-2"
                  >
                    <option value="informacion">Información</option>
                    <option value="votacion">Votación</option>
                  </select>
                  {/* Expositor */}
                  <select
                    value={item.expositor}
                    onChange={e => updateAgendaItem(idx, 'expositor', e.target.value)}
                    className="flex-1 border rounded px-3 py-2 ml-2"
                  >
                    <option value="">-- Expositor --</option>
                    {juntaMiembros.map(m => (
                      <option key={m._id} value={m._id}>{m.name} {m.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <button onClick={addAgendaItem} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              + Agregar punto de agenda
            </button>
          </div>
        )}

        {activeTab === 'notificacion' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Mensaje de Notificación</label>
            <textarea
              value={notificationMessage}
              onChange={e => setNotificationMessage(e.target.value)}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Escribe el mensaje a enviar..."
            />
          </div>
        )}
      </main>

      <footer className="px-6 py-4 bg-white text-right">
        <button onClick={programarAgenda} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          Programar Agenda
        </button>
      </footer>
    </div>
  )
}

export default CreateSessionPage
