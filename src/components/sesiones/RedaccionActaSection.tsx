import React, { useState } from 'react'

interface RedaccionActaSectionProps {
  sesionProgramada: boolean
  agendaAprobada: boolean
}

const RedaccionActaSection: React.FC<RedaccionActaSectionProps> = ({ sesionProgramada, agendaAprobada }) => {
  const [contenido, setContenido] = useState('')
  const [guardado, setGuardado] = useState(false)

  const puedeRedactar = sesionProgramada && agendaAprobada

  const handleGuardar = () => {
    if (!contenido.trim()) return alert('El acta no puede estar vacía')
    // Simulación de guardado
    setGuardado(true)
    console.log('Acta guardada:', contenido)
  }

  if (!puedeRedactar) {
    return (
      <div className="text-red-600 font-medium">
        No se puede redactar el acta. Asegúrese de que la sesión esté programada y la agenda esté aprobada.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <textarea
        value={contenido}
        onChange={e => setContenido(e.target.value)}
        className="w-full h-40 p-4 border border-gray-300 rounded resize-none"
        placeholder="Escribe aquí el acta de la sesión..."
      />

      <button
        onClick={handleGuardar}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Guardar Acta
      </button>

      {guardado && (
        <p className="text-green-600 font-medium">Acta guardada correctamente.</p>
      )}
    </div>
  )
}

export default RedaccionActaSection