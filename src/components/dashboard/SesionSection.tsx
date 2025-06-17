import React from 'react'

export interface Session {
  id: string
  tipo: string
  fechaHora: string
  modalidad: string
  estado: string
}

interface SessionsSectionProps {
  sessions: Session[]
  onBack: () => void
  loading: boolean
}

const SessionsSection: React.FC<SessionsSectionProps> = ({
  sessions,
  onBack,
  loading
}) => (
  <section className="space-y-6">
    <button
      onClick={onBack}
      className="text-blue-600 hover:underline mb-4"
    >
      ← Volver
    </button>

    <h2 className="text-xl font-semibold">Sesiones Programadas</h2>

    {loading ? (
      <p>Cargando sesiones…</p>
    ) : sessions.length === 0 ? (
      <p>No hay sesiones</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Tipo</th>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Modalidad</th>
              <th className="px-4 py-2 border">Estado</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{s.id}</td>
                <td className="px-4 py-2 border">{s.tipo}</td>
                <td className="px-4 py-2 border">
                  {new Date(s.fechaHora).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{s.modalidad}</td>
                <td className="px-4 py-2 border">{s.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
)

export default SessionsSection
