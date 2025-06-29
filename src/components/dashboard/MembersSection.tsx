import React from 'react'
import type { FC } from 'react'

export interface Member {
  nombre: string
  email: string
  roles: string[]
}

interface MembersSectionProps {
  members: Member[]
  onBack: () => void
}

const MembersSection: FC<MembersSectionProps> = ({ members, onBack }) => (
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
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Roles</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-800">{m.nombre}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{m.email}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{m.roles.join(', ')}</td>
            </tr>
          ))}
          {members.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                No hay miembros de junta.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
)

export default MembersSection;