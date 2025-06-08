import React from 'react'
import type { FC } from 'react'

export interface Acta {
  id: number
  fechaCreacion: string
  creador: string
}

interface ActasSectionProps {
  actas: Acta[]
  onBack: () => void
}

const ActasSection: FC<ActasSectionProps> = ({ actas, onBack }) => (
  <section>
    <button
      onClick={onBack}
      className="mb-4 text-blue-600 hover:underline"
    >
      ← Volver
    </button>

    <h2 className="text-xl font-medium mb-4">Actas creadas</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fecha de creación</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Creador</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actas.map(acta => (
            <tr key={acta.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-800">{acta.id}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{acta.fechaCreacion}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{acta.creador}</td>
              <td className="px-6 py-4 text-sm">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                  Descargar PDF
                </button>
              </td>
            </tr>
          ))}
          {actas.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No hay actas creadas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
)

export default ActasSection
