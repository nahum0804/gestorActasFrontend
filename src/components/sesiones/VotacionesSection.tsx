import React, { useState } from 'react'

interface PuntoAgenda {
  id: number
  titulo: string
  requiereVotacion: boolean
}

interface VotacionesSectionProps {
  puntos: PuntoAgenda[]
}

const VotacionesSection: React.FC<VotacionesSectionProps> = ({ puntos }) => {
  const [resultados, setResultados] = useState(() =>
    puntos.map(p => ({
      puntoId: p.id,
      aFavor: 0,
      enContra: 0,
      abstencion: 0,
      acta: ''
    }))
  )

  const handleChange = (puntoId: number, field: 'aFavor' | 'enContra' | 'abstencion' | 'acta', value: number | string) => {
    setResultados(prev =>
      prev.map(r => r.puntoId === puntoId ? { ...r, [field]: value } : r)
    )
  }

  const handleGuardarTodos = () => {
    console.log('Resultados a guardar:', resultados)
    // Aquí podrías hacer un POST al backend con los resultados.
    alert('✔ Resultados guardados (ver consola para detalles)')
  }

  return (
    <div className="space-y-6">
      {puntos.map(p => (
        <div key={p.id} className="border p-4 rounded shadow bg-white">
          <h3 className="text-lg font-semibold mb-2">{p.titulo}</h3>

          <div className="flex gap-4 mb-4">
            <label className="flex flex-col text-sm">
              A favor
              <input
                type="number"
                min={0}
                className="border rounded px-2 py-1"
                onChange={e => handleChange(p.id, 'aFavor', parseInt(e.target.value))}
              />
            </label>
            <label className="flex flex-col text-sm">
              En contra
              <input
                type="number"
                min={0}
                className="border rounded px-2 py-1"
                onChange={e => handleChange(p.id, 'enContra', parseInt(e.target.value))}
              />
            </label>
            <label className="flex flex-col text-sm">
              Abstenciones
              <input
                type="number"
                min={0}
                className="border rounded px-2 py-1"
                onChange={e => handleChange(p.id, 'abstencion', parseInt(e.target.value))}
              />
            </label>
          </div>

          <label className="block text-sm mb-1">Redacción del acta para este punto</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            onChange={e => handleChange(p.id, 'acta', e.target.value)}
          />
        </div>
      ))}

      <div className="text-right">
        <button
          onClick={handleGuardarTodos}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Guardar todos
        </button>
      </div>
    </div>
  )
}

export default VotacionesSection