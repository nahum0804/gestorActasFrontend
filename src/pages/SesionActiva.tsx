import React, { useEffect, useState } from 'react'
import RedaccionActaSection from '../components/sesiones/RedaccionActaSection'

interface Sesion {
  _id: string
  estado: string
  agenda: any[]
  invitados?: any[]
}

const SesionActiva: React.FC = () => {
  const [sesion, setSesion] = useState<Sesion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSesionPendiente = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log('Usando token:', token)

        const res = await fetch('http://localhost:3000/api/sesiones', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('No autorizado o error al obtener sesiones')

        const sesiones = await res.json()
        const pendiente = sesiones.find((s: any) => s.estado === 'PENDIENTE')

        if (!pendiente) throw new Error('No hay sesión activa en estado PENDIENTE')

        setSesion(pendiente)
      } catch (err) {
        console.error('Error al cargar la sesión activa:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSesionPendiente()
  }, [])

  if (loading) return <p>Cargando sesión activa...</p>
  if (!sesion) return <p>No hay sesión activa en estado PENDIENTE.</p>

  const agendaAprobada = Array.isArray(sesion.agenda) && sesion.agenda.length > 0
  const sesionPendiente = sesion.estado === 'PENDIENTE'

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sesión Activa</h2>
      <RedaccionActaSection
        sesionId={sesion._id}
        sesion={sesion}
        agendaAprobada={agendaAprobada}
        sesionPendiente={sesionPendiente}
      />
    </div>
  )
}

export default SesionActiva