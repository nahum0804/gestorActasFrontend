import React, { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import emailjs from 'emailjs-com'

interface RedaccionActaSectionProps {
  sesionId: string
  sesion: any
  sesionPendiente: boolean
  agendaAprobada: boolean
}

const RedaccionActaSection: React.FC<RedaccionActaSectionProps> = ({
  sesionId,
  sesion,
  sesionPendiente,
  agendaAprobada,
}) => {
  const [contenido, setContenido] = useState('')
  const [correos, setCorreos] = useState('')
  const [guardado, setGuardado] = useState(false)
  const [descargando, setDescargando] = useState(false)
  const [error, setError] = useState('')
  const [resolucionesFormulario, setResolucionesFormulario] = useState<any[]>([])
  const [justificaciones, setJustificaciones] = useState<any[]>([])

  const puedeRedactar = sesionPendiente && agendaAprobada

  useEffect(() => {
    const cargarPuntos = async () => {
      const token = localStorage.getItem('token')

      if (!sesion?.agenda || sesion.agenda.length === 0) {
        console.warn('Agenda vacía o no definida')
        return
      }

      try {
        const puntosCompletos = await Promise.all(
          sesion.agenda.map(async (puntoId: string) => {
            const res = await fetch(`http://localhost:3000/api/sesiones/punto/${puntoId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            if (!res.ok) throw new Error('Error al cargar punto de agenda')
            const punto = await res.json()
			console.log(punto)
            return {
              punto: {
                id: punto._id,
                titulo: punto.titulo,
                orden: punto.orden,
                tipo: punto.tipo,
                expositorNombre: punto.expositor
              },
              resumen: '',
              votosAFavor: 0,
              votosEnContra: 0,
              abstencion: 0,
              responsable: '',
              enlaceUrl: punto.enlaceUrl,
              enlaceTexto: punto.enlaceTexto
            }
          })
        )
        setResolucionesFormulario(puntosCompletos)
      } catch (err) {
        console.error('Error cargando puntos de agenda:', err)
      }
    }

    cargarPuntos()
  }, [sesion])

  const handleCambioResolucion = (index: number, campo: string, valor: any) => {
    const nuevas = [...resolucionesFormulario]
    nuevas[index][campo] = valor
    setResolucionesFormulario(nuevas)
  }

  const handleAgregarJustificacion = () => {
    setJustificaciones([...justificaciones, { invitadoEmail: '', razon: '' }])
  }

  const handleCambioJustificacion = (index: number, campo: string, valor: string) => {
    const nuevas = [...justificaciones]
    nuevas[index][campo] = valor
    setJustificaciones(nuevas)
  }

  const guardarActa = async () => {
    const token = localStorage.getItem('token')
    const resoluciones = resolucionesFormulario.map((res) => ({
      punto: res.punto?.id || '',
      resumen: res.resumen || '',
      votosAFavor: parseInt(res.votosAFavor) || 0,
      votosEnContra: parseInt(res.votosEnContra) || 0,
      abstencion: parseInt(res.abstencion) || 0,
      responsable: res.responsable || '',
    }))

    const response = await fetch(`http://localhost:3000/api/sesiones/${sesionId}/acta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resoluciones, justificaciones }),
    })
    if (!response.ok) {
      const errorText = await response.text()
      let mensaje = 'Error al guardar el acta'
      try {
        const parsed = JSON.parse(errorText)
        mensaje = Array.isArray(parsed.message) ? parsed.message.join(', ') : parsed.message
      } catch {
        mensaje = errorText
      }
      throw new Error(mensaje)
    }
  }

  const generarPdf = (): string => {
    const doc = new jsPDF()
    const marginX = 20
    let y = 20

    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('ACTA DE SESIÓN', marginX, y)
    y += 10

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    doc.text(`Sesión realizada el ${new Date().toLocaleDateString('es-CR', {
      year: 'numeric', month: 'long', day: 'numeric'
    })}`, marginX, y)
    y += 8
    doc.text(`Lugar: ${sesion?.lugar || 'No especificado'}`, marginX, y)
    y += 8
    doc.text(`Hora de inicio: ${sesion?.hora || 'No especificada'}`, marginX, y)
    y += 10

    if (sesion?.invitados?.length > 0) {
      doc.setFont(undefined, 'bold')
      doc.text('Participantes presentes:', marginX, y)
      y += 6
      doc.setFont(undefined, 'normal')
      sesion.invitados.forEach((inv: any) => {
        doc.text(`- ${inv.nombre} (${inv.correo})`, marginX + 4, y)
        y += 6
      })
      y += 4
    }

    if (justificaciones.length > 0) {
      doc.setFont(undefined, 'bold')
      doc.text('Ausencias justificadas:', marginX, y)
      y += 6
      doc.setFont(undefined, 'normal')
      justificaciones.forEach((jus, idx) => {
        doc.text(`- ${jus.invitadoEmail}: ${jus.razon}`, marginX + 4, y)
        y += 6
      })
      y += 4
    }

    doc.setFont(undefined, 'bold')
    doc.text('Contenido del acta:', marginX, y)
    y += 6
    doc.setFont(undefined, 'normal')
    const contenidoLines = doc.splitTextToSize(contenido, 170)
    doc.text(contenidoLines, marginX, y)
    y += contenidoLines.length * 6 + 6

    doc.setFont(undefined, 'bold')
    doc.text('Resoluciones:', marginX, y)
    y += 8

    resolucionesFormulario.forEach((res, idx) => {
      doc.setFont(undefined, 'bold')
      doc.text(`Artículo ${res.punto.orden || idx + 1}: ${res.punto?.titulo || '(Sin título)'}`, marginX, y)
      y += 6
      doc.setFont(undefined, 'normal')
      doc.text(`Tipo: ${res.punto.tipo}`, marginX, y)
      y += 6
      doc.text(`Resumen: ${res.resumen || '-'}`, marginX, y)
      y += 6
      doc.text(`Resultado de votación:`, marginX, y)
      y += 6
      doc.text(`  - Votos a favor: ${res.votosAFavor}`, marginX + 4, y)
      y += 6
      doc.text(`  - Votos en contra: ${res.votosEnContra}`, marginX + 4, y)
      y += 6
      doc.text(`  - Abstenciones: ${res.abstencion}`, marginX + 4, y)
      y += 6
      doc.text(`Acuerdo: ACUERDO FIRME`, marginX, y)
      y += 10
    })

    doc.setFont(undefined, 'bold')
    doc.text('__________________________________', marginX, y)
    y += 6
    doc.setFont(undefined, 'normal')
    doc.text(`${sesion?.presidente || 'Nombre del Presidente'}`, marginX, y)
    y += 6
    doc.text('Presidente del Consejo', marginX, y)
    y += 6
    doc.text('Carrera Ingeniería en Computación', marginX, y)
    y += 6
    doc.text('Campus Tecnológico Local de San José', marginX, y)

    doc.save('acta.pdf')
    const base64 = doc.output('dataurlstring').split(',')[1]
    return `data:application/pdf;base64,${base64}`
  }

  const handleGuardar = async () => {
    setError('')
    setGuardado(false)

    if (!contenido.trim()) {
      setError('El acta no puede estar vacía')
      return
    }

    try {
      await guardarActa()
  
      setGuardado(true)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error desconocido')
    }
  }

  if (!puedeRedactar) {
    return (
      <div className="text-red-600 font-medium">
        No se puede redactar el acta. Asegúrese de que la sesión esté en estado PENDIENTE y la agenda esté aprobada.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        className="w-full h-40 p-4 border border-gray-300 rounded resize-none"
        placeholder="Escribe aquí el acta de la sesión..."
      />

      <div>
        <h3 className="font-semibold">Resoluciones por Punto</h3>
          {resolucionesFormulario.map((res, idx) => {
            const tipoLower = res.punto.tipo.toLowerCase()
            const esVotable = tipoLower === 'votacion' || tipoLower === 'estrategico'
            return (
              <div key={idx} className="border p-4 mb-4 rounded">
                {/* Título del punto */}
                <p className="font-medium">
                  Punto {res.punto.orden || idx + 1}: {res.punto.titulo}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Tipo: {res.punto.tipo}
                </p>

                {/* Aquí mostramos el expositor */}
                {res.punto.expositor && (
                  <p className="text-sm text-gray-700 mb-3">
                    <span className="font-medium">Expositor:</span>{' '}
                    {res.punto.expositor}
                  </p>
                )}

                {res.punto.enlaceUrl && (
                  <p className="mb-2">
                    <a
                      href={res.punto.enlaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {res.punto.enlaceTexto || 'Ver documento'}
                    </a>
                  </p>
                )}

                {/* Resumen */}
                <label className="block text-sm font-medium mb-1">Resumen</label>
                <textarea
                  rows={2}
                  className="w-full p-2 border rounded mb-4"
                  value={res.resumen}
                  onChange={e => handleCambioResolucion(idx, 'resumen', e.target.value)}
                />

                {/* Responsable solo para ESTRATEGICO */}
                {tipoLower === 'estrategico' && (
                  <>
                    <label className="block text-sm font-medium mb-1">
                      Responsable (correo)
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded mb-4"
                      value={res.responsable}
                      onChange={e =>
                        handleCambioResolucion(idx, 'responsable', e.target.value)
                      }
                    />
                  </>
                )}

                {/* Votos */}
                {esVotable && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">A favor</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={res.votosAFavor}
                        onChange={e =>
                          handleCambioResolucion(idx, 'votosAFavor', e.target.value)
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">En contra</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={res.votosEnContra}
                        onChange={e =>
                          handleCambioResolucion(idx, 'votosEnContra', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Abstenciones</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={res.abstencion}
                        onChange={e =>
                          handleCambioResolucion(idx, 'abstencion', e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>

      <div>
        <h3 className="font-semibold">Justificación de Ausencias</h3>
        {justificaciones.map((jus, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <select
              value={jus.invitadoEmail}
              onChange={(e) => handleCambioJustificacion(idx, 'invitadoEmail', e.target.value)}
              className="w-1/2 p-2 border rounded"
            >
              <option value="">Seleccionar invitado</option>
              {sesion?.invitados?.map((inv: any) => (
                <option key={inv._id} value={inv.correo}>
                  {inv.nombre} ({inv.correo})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Razón de ausencia"
              value={jus.razon}
              onChange={(e) => handleCambioJustificacion(idx, 'razon', e.target.value)}
              className="w-1/2 p-2 border rounded"
            />
          </div>
        ))}
        <button
          onClick={handleAgregarJustificacion}
          className="text-blue-600 hover:underline"
        >
          + Añadir Justificación
        </button>
      </div>

      <button
        onClick={ async () => { handleGuardar(); generarPdf(); } }
        disabled={descargando}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {descargando ? 'Descargando...' : 'Descargar Acta'}
      </button>

      {guardado && (
        <p className="text-green-600 font-medium">✅ Acta guardada, enviada y descargada correctamente.</p>
      )}

      {error && (
        <p className="text-red-500 font-medium">⚠️ {error}</p>
      )}
    </div>
  )
}

export default RedaccionActaSection