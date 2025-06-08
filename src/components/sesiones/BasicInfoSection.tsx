import React, { useState } from 'react'
import type { FC } from 'react'

interface BasicInfoProps {
  markDirty: () => void
}

const sessionTypes = [
  { label: 'Sesión Ordinaria (SO)', code: 'SO' },
  { label: 'Otro…',              code: 'OT' },
]

const meetingTypes = ['Presencial', 'Virtual', 'Híbrida']
const platforms   = ['Zoom', 'Teams', 'Google Meet', 'Otro']

const BasicInfoSection: FC<BasicInfoProps> = ({ markDirty }) => {
  const [title, setTitle]           = useState('')
  const [type, setType]             = useState(sessionTypes[0].code)
  const [number, setNumber]         = useState('')
  const [year, setYear]             = useState(new Date().getFullYear().toString())
  const [organizer, setOrganizer]   = useState('')
  const [date, setDate]             = useState('')
  const [time, setTime]             = useState('')
  const [meetingType, setMeetingType] = useState(meetingTypes[2])
  const [location, setLocation]     = useState('')
  const [platform, setPlatform]     = useState(platforms[0])

  return (
    <section className="space-y-6 bg-white p-6 rounded shadow">
      {/* FILA 1: Título y Código */}
      <div className="grid grid-cols-2 gap-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium">Título de la Sesión</label>
          <input
            type="text"
            value={title}
            onChange={e => { markDirty(); setTitle(e.target.value) }}
            placeholder="Sesión ordinaria el día …"
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        {/* Código */}
        <div>
          <label className="block text-sm font-medium">Código de Sesión</label>
          <div className="flex space-x-2 items-center mt-1">
            <select
              value={type}
              onChange={e => { markDirty(); setType(e.target.value) }}
              className="border rounded px-3 py-2"
            >
              {sessionTypes.map(st => (
                <option key={st.code} value={st.code}>{st.label}</option>
              ))}
            </select>
            
          </div>
        </div>
      </div>

      {/* FILA 2: Organizador, Fecha, Hora */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium">Organizador de la Sesión</label>
          <input
            type="text"
            value={organizer}
            onChange={e => { markDirty(); setOrganizer(e.target.value) }}
            placeholder="Marlon Vargas Alvarado"
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha de la Reunión</label>
          <input
            type="date"
            value={date}
            onChange={e => { markDirty(); setDate(e.target.value) }}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hora de la Reunión</label>
          <input
            type="time"
            value={time}
            onChange={e => { markDirty(); setTime(e.target.value) }}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* FILA 3: Tipo, Ubicación, Plataforma */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium">Tipo de Reunión</label>
          <select
            value={meetingType}
            onChange={e => { markDirty(); setMeetingType(e.target.value) }}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            {meetingTypes.map(mt => <option key={mt}>{mt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Ubicación</label>
          <input
            type="text"
            value={location}
            onChange={e => { markDirty(); setLocation(e.target.value) }}
            placeholder="San José"
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Plataforma</label>
          <select
            value={platform}
            onChange={e => { markDirty(); setPlatform(e.target.value) }}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            {platforms.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
    </section>
  )
}

export default BasicInfoSection