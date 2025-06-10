import React, { useState } from 'react'

interface Justificacion {
  informante: string
  ausente: string
  motivo: string
}

const JustificacionAusenciasSection: React.FC = () => {
  const [informante, setInformante] = useState('')
  const [ausente, setAusente] = useState('')
  const [motivo, setMotivo] = useState('')
  const [justificaciones, setJustificaciones] = useState<Justificacion[]>([])

  const handleAgregar = () => {
    if (!informante || !ausente || !motivo) {
      alert('Por favor complete todos los campos')
      return
    }

    const nueva = { informante, ausente, motivo }
    setJustificaciones([...justificaciones, nueva])
    setInformante('')
    setAusente('')
    setMotivo('')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Persona que informa"
          value={informante}
          onChange={e => setInformante(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Persona ausente"
          value={ausente}
          onChange={e => setAusente(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <textarea
        placeholder="Justificación"
        value={motivo}
        onChange={e => setMotivo(e.target.value)}
        className="w-full h-24 border border-gray-300 rounded px-3 py-2"
      />

      <button
        onClick={handleAgregar}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Registrar Justificación
      </button>

      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Justificaciones Registradas:</h3>
        {justificaciones.length === 0 ? (
          <p className="text-gray-500">No hay justificaciones aún.</p>
        ) : (
          <ul className="space-y-2">
            {justificaciones.map((j, index) => (
              <li key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                <p><strong>Informante:</strong> {j.informante}</p>
                <p><strong>Ausente:</strong> {j.ausente}</p>
                <p><strong>Motivo:</strong> {j.motivo}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default JustificacionAusenciasSection