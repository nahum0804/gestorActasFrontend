import React from 'react'
import { FileText, Users } from 'lucide-react'

interface SummaryCardsProps {
  totalSessions: number
  totalMembers: number
  onSessionsClick: () => void
  onMembersClick: () => void
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSessions,
  totalMembers,
  onSessionsClick,
  onMembersClick
}) => (
  <div>
    {/* Encabezado */}
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-semibold text-gray-800">
        Bienvenido al Sistema de Gestión de Sesiones TEC
      </h2>
      <p className="mt-1 text-gray-600">
        Visualice y gestione documentos, registros de sesiones y más
      </p>
    </div>

    {/* Tarjetas apiladas */}
    <div className="flex flex-col gap-4">
      {/* Sesiones Recientes */}
      <button
        onClick={onSessionsClick}
        className="w-full flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
      >
        <div className="p-3 bg-blue-100 rounded-full">
          <FileText className="text-blue-600" size={24} />
        </div>
        <div className="ml-4 text-left">
          <h3 className="text-lg font-semibold text-gray-800">Sesiones Recientes</h3>
          <p className="mt-1 text-gray-500">{totalSessions} documentos</p>
        </div>
      </button>

      {/* Miembros de Junta */}
      <button
        onClick={onMembersClick}
        className="w-full flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
      >
        <div className="p-3 bg-blue-100 rounded-full">
          <Users className="text-blue-600" size={24} />
        </div>
        <div className="ml-4 text-left">
          <h3 className="text-lg font-semibold text-gray-800">Miembros de Junta</h3>
          <p className="mt-1 text-gray-500">{totalMembers} miembros</p>
        </div>
      </button>
    </div>
  </div>
)

export default SummaryCards
