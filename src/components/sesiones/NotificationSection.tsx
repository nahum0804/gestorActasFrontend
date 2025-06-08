import React, { useState } from 'react'
import type { FC } from 'react'

interface NotificationProps {
  markDirty: () => void
}

const NotificationSection: FC<NotificationProps> = ({ markDirty }) => {
  const [sendNow, setSendNow] = useState(true)
  const [reminder24, setReminder24] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [fechaNotif, setFechaNotif] = useState('')
  const [horaNotif, setHoraNotif] = useState('')

  const toggle = (fn: () => void) => { markDirty(); fn() }

  return (
    <section className="space-y-4 bg-white p-6 rounded shadow">
      <label className="block text-sm font-medium">Mensaje de la Convocatoria</label>
      <input
        type="text"
        onChange={markDirty}
        className="mt-1 w-full border rounded px-3 py-2"
        placeholder="Confirmar asistencia."
      />

      <div className="space-y-2">
        <label className="flex items-center">
          <input type="checkbox" checked={sendNow} onChange={() => toggle(() => setSendNow(!sendNow))} className="mr-2" />
          Enviar notificación inmediatamente
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={reminder24} onChange={() => toggle(() => setReminder24(!reminder24))} className="mr-2" />
          Enviar recordatorio 24 horas antes
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={scheduled} onChange={() => toggle(() => setScheduled(!scheduled))} className="mr-2" />
          Programar Notificación
        </label>
        {scheduled && (
          <div className="flex items-center space-x-2">
            <input type="date" onChange={e => { markDirty(); setFechaNotif(e.target.value) }} className="border rounded px-2 py-1" />
            <input type="time" onChange={e => { markDirty(); setHoraNotif(e.target.value) }} className="border rounded px-2 py-1" />
            <button onClick={markDirty} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Programar</button>
          </div>
        )}
      </div>

      <div>
        <p className="font-medium">Destinatarios de la Notificación</p>
        <ul className="mt-2 space-y-1">
          {['Marlon Vargas Alvarado','Jose Altamirano Rivera','Anthony Quesada Alfaro'].map(name=>(
            <li key={name} className="flex justify-between border-b py-1">
              <span>{name}</span>
              <span className="text-gray-500 text-sm">{name.split(' ')[1].toLowerCase()}@example.com</span>
            </li>
          ))}
        </ul>
      </div>

      <label className="flex items-center space-x-2">
        <input type="checkbox" onChange={markDirty} className="mr-2" />
        Vista previa del correo
      </label>
    </section>
  )
}

export default NotificationSection
