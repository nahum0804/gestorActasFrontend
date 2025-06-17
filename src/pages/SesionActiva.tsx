// src/pages/SesionActiva.tsx
import React from 'react'

interface SesionActivaProps {
  onBack: () => void
}

const SesionActiva: React.FC<SesionActivaProps> = ({ onBack }) => {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Volver
      </button>

      <h2 className="text-xl font-semibold">Sesión Activa</h2>
      
    </div>
  )
}

export default SesionActiva
