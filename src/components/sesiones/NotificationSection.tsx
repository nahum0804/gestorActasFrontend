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
  const [sendPDF, setSendPDF] = useState(false)

  const toggle = (fn: () => void) => {
    markDirty()
    fn()
  }

  const handleDescargarPDF = () => {
    window.open('/ruta-a-tu-pdf-generado.pdf', '_blank')
  }

  return (
    <section className="space-y-8 bg-white p-8 rounded shadow">
      {/* Mensaje */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Mensaje de la Convocatoria</label>
        <input
          type="text"
          onChange={markDirty}
          className="w-full border rounded px-3 py-2"
          placeholder="Confirmar asistencia."
        />
      </div>

      {/* Opciones de envío */}
      <div className="space-y-3">
        <label className="flex items-center">
          <input type="checkbox" checked={sendNow} onChange={() => toggle(() => setSendNow(!sendNow))} className="mr-2 w-5 h-5" />
          Enviar notificación inmediatamente
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={reminder24} onChange={() => toggle(() => setReminder24(!reminder24))} className="mr-2 w-5 h-5" />
          Enviar recordatorio 24 horas antes
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={scheduled} onChange={() => toggle(() => setScheduled(!scheduled))} className="mr-2 w-5 h-5" />
          Programar Notificación
        </label>

        {scheduled && (
          <div className="mt-3 flex items-center space-x-4">
            <input type="date" onChange={e => { markDirty(); setFechaNotif(e.target.value) }} className="border rounded px-3 py-1" />
            <input type="time" onChange={e => { markDirty(); setHoraNotif(e.target.value) }} className="border rounded px-3 py-1" />
            <button onClick={markDirty} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded">
              Programar
            </button>
          </div>
        )}
      </div>

      {/* Destinatarios */}
      <div className="space-y-2">
        <p className="font-medium text-base">Destinatarios de la Notificación</p>
        <ul className="space-y-3">
          {['Marlon Vargas Alvarado', 'Jose Altamirano Rivera', 'Anthony Quesada Alfaro'].map(name => (
            <li key={name} className="flex justify-between border-b pb-1">
              <span>{name}</span>
              <span className="text-gray-500 text-sm">{name.split(' ')[1].toLowerCase()}@example.com</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opciones finales */}
      <div className="space-y-4 pt-4">
        <label className="flex items-center">
          <input type="checkbox" onChange={markDirty} className="mr-2 w-5 h-5" />
          Vista previa del correo
        </label>

        <label className="flex items-center">
          <input type="checkbox" checked={sendPDF} onChange={() => toggle(() => setSendPDF(!sendPDF))} className="mr-2 w-5 h-5" />
          Enviar PDF junto con la notificación
        </label>

        <button
          onClick={handleDescargarPDF}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Descargar PDF
        </button>
      </div>
    </section>
  )
}

export default NotificationSection