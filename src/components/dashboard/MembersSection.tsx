import React, { useState } from 'react'
import type { FC } from 'react'

export interface Member {
  nombre: string
  email: string
  rol?: string
}

interface MembersSectionProps {
  members: Member[]
  onBack: () => void
  isAdmin: boolean
}

const MembersSection: FC<MembersSectionProps> = ({ members, onBack, isAdmin }) => {
  const [nuevosMiembros, setNuevosMiembros] = useState<Member[]>(members)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoEmail, setNuevoEmail] = useState('')

  const handleAdd = () => {
    if (!nuevoNombre || !nuevoEmail) return
    const nuevo: Member = { nombre: nuevoNombre, email: nuevoEmail }
    setNuevosMiembros([...nuevosMiembros, nuevo])
    setNuevoNombre('')
    setNuevoEmail('')
  }

  const handleRemove = (index: number) => {
    const copia = [...nuevosMiembros]
    copia.splice(index, 1)
    setNuevosMiembros(copia)
  }

  return (
    <section>
      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Volver
      </button>
      <h2 className="text-xl font-medium mb-4">Miembros de Junta</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {nuevosMiembros.map((m, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{m.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{m.email}</td>
                {isAdmin && (
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleRemove(i)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {nuevosMiembros.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 3 : 2} className="px-6 py-4 text-center text-gray-500">
                  No hay miembros de junta.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAdmin && (
        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-medium">Agregar nuevo miembro</h3>
          <div className="flex gap-2">
            <input
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              placeholder="Nombre"
              className="border p-2 rounded w-1/2"
            />
            <input
              value={nuevoEmail}
              onChange={e => setNuevoEmail(e.target.value)}
              placeholder="Email"
              className="border p-2 rounded w-1/2"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
            >
              Agregar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default MembersSection
