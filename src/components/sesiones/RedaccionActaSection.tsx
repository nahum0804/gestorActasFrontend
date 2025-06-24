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
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [resolucionesFormulario, setResolucionesFormulario] = useState<any[]>([])
  const [justificaciones, setJustificaciones] = useState<any[]>([])

  const puedeRedactar = sesionPendiente && agendaAprobada

  useEffect(() => {
    if (sesion?.agenda?.length > 0) {
      const inicial = sesion.agenda.map((punto: any) => ({
        punto: typeof punto === 'string' ? punto : punto._id,
        resumen: '',
        votosAFavor: 0,
        votosEnContra: 0,
        abstencion: 0,
      }))
      setResolucionesFormulario(inicial)
    }
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
      punto: typeof res.punto === 'string' ? res.punto : res.punto?._id || '',
      resumen: res.resumen || '',
      votosAFavor: parseInt(res.votosAFavor) || 0,
      votosEnContra: parseInt(res.votosEnContra) || 0,
      abstencion: parseInt(res.abstencion) || 0,
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
    doc.text('Acta de Sesion', 10, 10)
    doc.text(contenido, 10, 20)

    doc.text('Resoluciones:', 10, 30)
    resolucionesFormulario.forEach((res, idx) => {
      doc.text(
        `Punto ${idx + 1}: ${res.punto}\nResumen: ${res.resumen}\nA Favor: ${res.votosAFavor}, En Contra: ${res.votosEnContra}, Abstención: ${res.abstencion}`,
        10,
        40 + idx * 20
      )
    })

    doc.text('Justificaciones:', 10, 40 + resolucionesFormulario.length * 20)
    justificaciones.forEach((jus, idx) => {
      doc.text(`Ausente: ${jus.invitadoEmail}, Razón: ${jus.razon}`, 10, 50 + resolucionesFormulario.length * 20 + idx * 10)
    })

    doc.save('acta.pdf')
    const base64 = doc.output('dataurlstring').split(',')[1]
    return `data:application/pdf;base64,${base64}`
  }

  const enviarCorreo = async (pdfBase64: string) => {
    const listaCorreos = correos.split(',').map(c => c.trim()).filter(c => c.length > 0)
    if (listaCorreos.length === 0) throw new Error('No se encontraron correos válidos para enviar.')

    for (const correo of listaCorreos) {
      await emailjs.send(
        'service_i73yyoi',
        'template_0ddie3x',
        {
          email: correo,
          message: 'Acta de sesión redactada.',
          attachment: pdfBase64,
        },
        'PAk_0pLu4r-tPDVue'
      )
    }
  }

  const handleGuardarYEnviar = async () => {
    setError('')
    setGuardado(false)

    if (!contenido.trim()) {
      setError('El acta no puede estar vacía')
      return
    }

    if (!correos.trim()) {
      setError('Por favor ingresa al menos un correo destinatario')
      return
    }

    setEnviando(true)
    try {
      await guardarActa()
      const pdfBase64 = generarPdf()
      await enviarCorreo(pdfBase64)
      setGuardado(true)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error desconocido')
    } finally {
      setEnviando(false)
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
        {resolucionesFormulario.map((res, idx) => (
          <div key={idx} className="border p-3 mb-2 rounded">
            <p className="font-medium">Punto ID: {res.punto}</p>
            <input
              type="text"
              placeholder="Resumen"
              value={res.resumen}
              onChange={(e) => handleCambioResolucion(idx, 'resumen', e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              placeholder="Votos a favor"
              value={res.votosAFavor}
              onChange={(e) => handleCambioResolucion(idx, 'votosAFavor', e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              placeholder="Votos en contra"
              value={res.votosEnContra}
              onChange={(e) => handleCambioResolucion(idx, 'votosEnContra', e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              placeholder="Abstenciones"
              value={res.abstencion}
              onChange={(e) => handleCambioResolucion(idx, 'abstencion', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
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

      <input
        type="text"
        value={correos}
        onChange={(e) => setCorreos(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded"
        placeholder="Correo(s) destinatario(s), separados por coma"
      />

      <button
        onClick={handleGuardarYEnviar}
        disabled={enviando}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {enviando ? 'Enviando...' : 'Guardar y Enviar Acta'}
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