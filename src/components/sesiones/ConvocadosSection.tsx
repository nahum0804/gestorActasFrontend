import React, { FC } from 'react'

interface ConvocadosProps {
  markDirty: () => void
}

const convocadosFijos = [
  { nombre: 'Marlon Vargas Alvarado', rol: 'Profesor' },
  { nombre: 'Jose Altamirano Rivera',  rol: 'Profesor' },
  { nombre: 'Anthony Quesada Alfaro',   rol: 'Estudiante' },
]

const ConvocadosSection: FC<ConvocadosProps> = ({ markDirty }) => (
  <section className="space-y-4 bg-white p-6 rounded shadow">
    <div className="space-y-2">
      {convocadosFijos.map(({ nombre, rol }) => (
        <label key={nombre} className="flex items-center">
          <input type="checkbox" onChange={markDirty} className="mr-2" />
          {nombre}
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {rol}
          </span>
        </label>
      ))}
    </div>
    <hr />
    <div className="flex space-x-2">
      <input onChange={markDirty} type="text" placeholder="Nombre" className="flex-1 border rounded px-3 py-2" />
      <input onChange={markDirty} type="email" placeholder="ejemplo@ejemplo.com" className="flex-1 border rounded px-3 py-2" />
      <select onChange={markDirty} className="border rounded px-3 py-2">
        <option>Otro</option>
        <option>Profesor</option>
        <option>Estudiante</option>
      </select>
      <button onClick={markDirty} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded">+ Agregar</button>
    </div>
    <div className="flex justify-center space-x-2 mt-4">
      {['Todos Presentes','Todos Ausentes','Personalizado'].map(label => (
        <button
          key={label}
          onClick={markDirty}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          {label}
        </button>
      ))}
    </div>
  </section>
)

export default ConvocadosSection