import React, { useState } from 'react'

export interface Convocado {
  id: number
  nombre: string
  presente: boolean
}

interface RegistroAsistenciaSectionProps {
  convocadosIniciales: Convocado[]
}

const RegistroAsistenciaSection: React.FC<RegistroAsistenciaSectionProps> = ({ convocadosIniciales }) => {
  const [convocados, setConvocados] = useState<Convocado[]>(convocadosIniciales)

  const total = convocados.length
  const presentes = convocados.filter(c => c.presente).length
  const hayQuorum = presentes >= Math.ceil(total / 2)

  const toggleAsistencia = (index: number) => {
    const copia = [...convocados]
    copia[index].presente = !copia[index].presente
    setConvocados(copia)
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {convocados.map((convocado, index) => (
          <li key={convocado.id} className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={convocado.presente}
              onChange={() => toggleAsistencia(index)}
              className="w-5 h-5"
            />
            <span>{convocado.nombre}</span>
          </li>
        ))}
      </ul>
      <div className="text-sm text-gray-700">
        Presentes: <strong>{presentes}</strong> / {total} &nbsp; | &nbsp;
        {hayQuorum ? (
          <span className="text-green-600 font-medium">✅ Hay quórum</span>
        ) : (
          <span className="text-red-600 font-medium">❌ No hay quórum</span>
        )}
      </div>
    </div>
  )
}

export default RegistroAsistenciaSection