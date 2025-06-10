import React, { useState } from 'react'

interface PuntoDeAgenda {
  id: number
  titulo: string
}

interface VotacionesSectionProps {
  puntos: PuntoDeAgenda[]
}

const VotacionesSection: React.FC<VotacionesSectionProps> = ({ puntos }) => {
  const [votos, setVotos] = useState<Record<number, 'favor' | 'contra' | 'abstencion' | undefined>>({})

  const handleVoto = (puntoId: number, voto: 'favor' | 'contra' | 'abstencion') => {
    setVotos(prev => ({ ...prev, [puntoId]: voto }))
  }

  return (
    <div className="space-y-6">
      {puntos.map(p => (
        <div key={p.id} className="border p-4 rounded shadow bg-white">
          <h3 className="font-medium text-gray-800 mb-2">{p.titulo}</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`voto-${p.id}`}
                value="favor"
                checked={votos[p.id] === 'favor'}
                onChange={() => handleVoto(p.id, 'favor')}
              />
              <span>A favor</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`voto-${p.id}`}
                value="contra"
                checked={votos[p.id] === 'contra'}
                onChange={() => handleVoto(p.id, 'contra')}
              />
              <span>En contra</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`voto-${p.id}`}
                value="abstencion"
                checked={votos[p.id] === 'abstencion'}
                onChange={() => handleVoto(p.id, 'abstencion')}
              />
              <span>Abstención</span>
            </label>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Resultado: {
              votos[p.id] === 'favor' ? '✅ A favor' :
              votos[p.id] === 'contra' ? '❌ En contra' :
              votos[p.id] === 'abstencion' ? 'Abstención' :
              '— Sin votar'
            }
          </div>
        </div>
      ))}
    </div>
  )
}

export default VotacionesSection
