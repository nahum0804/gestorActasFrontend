import React from 'react'
import RegistroAsistenciaSection from '../components/sesiones/RegistroAsistenciaSection'
import VotacionesSection from '../components/sesiones/VotacionesSection'
import RedaccionActaSection from '../components/sesiones/RedaccionActaSection'
import JustificacionAusenciasSection from '../components/sesiones/JustificacionAusenciasSection'

const SesionActiva: React.FC = () => {
  const convocados = [
    { id: 1, nombre: 'Marlon Vargas Alvarado', presente: false },
    { id: 2, nombre: 'Jose Altamirano Rivera', presente: false },
    { id: 3, nombre: 'Anthony Quesada Alfaro', presente: false },
  ]

  const puntosAgenda = [
    { id: 1, titulo: 'Aprobación del acta anterior' },
    { id: 2, titulo: 'Presupuesto 2025' },
    { id: 3, titulo: 'Nombramiento de nuevos miembros' },
  ]

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Sesión Activa</h1>
	  
	  {/* Botón Volver */}
	        <button
	          onClick={() => navigate('/menu')}
	          className="text-blue-600 hover:underline mb-4"
	        >
	          ← Volver
	        </button>
      {/* Sección 1: Registro de asistencia y quórum */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Asistencia y Quórum</h2>
        <RegistroAsistenciaSection convocadosIniciales={convocados} />
      </section>

      {/* Sección 2: Votaciones por punto */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Votaciones por Punto de Agenda</h2>
        <VotacionesSection puntos={puntosAgenda} />
      </section>
	  {/* Sección 3: Redacción del Acta */}
	  <section className="bg-white shadow rounded p-4">
	    <h2 className="text-lg font-semibold mb-2">Redacción del Acta</h2>
	    <RedaccionActaSection
	      sesionProgramada={true} 
	      agendaAprobada={true}
	    />
	  </section>
	  {/* Sección 4: Justificación de Ausencias */}
	  <section className="bg-white shadow rounded p-4">
	    <h2 className="text-lg font-semibold mb-2">Justificación de Ausencias</h2>
	    <JustificacionAusenciasSection />
	  </section>
    </div>
  )
}

export default SesionActiva