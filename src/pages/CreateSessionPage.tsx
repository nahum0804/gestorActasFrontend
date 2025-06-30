import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import emailjs from 'emailjs-com'

type TabKey = 'info' | 'asistentes' | 'agenda' | 'notificacion'

interface InfoData {
  tipo: 'ORDINARIA' | 'EXTRAORDINARIA'
  fecha: string
  hora: string
  modalidad: string
  plataforma?: string | null
  ubicacion: string
  juntaDirectiva: string
  encargado: string
}

interface Invitado {
  nombre: string
  correo: string
}

type PuntoTipo = 'informacion' | 'votacion' | 'estrategico' | 'varios'
interface AgendaPunto {
  titulo: string
  orden: number
  expositor: string   
  tipo: PuntoTipo
  duracion: number     
  responsable?: string
  enlaceUrl?: string  
  enlaceTexto?: string
}

interface JuntaMiembro {
  _id: string
  name: string
  lastName: string
  email: string
}

const CreateSessionPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('info')

  const userId = localStorage.getItem('userId') || ''
  const storedName = localStorage.getItem('userName') || '';
  const storedLastName = localStorage.getItem('userLastName') || '';
  const [infoData, setInfoData] = useState<InfoData>({
    tipo: 'ORDINARIA', fecha: '', hora: '', modalidad: 'Híbrida', plataforma: 'Zoom', ubicacion: '',
    juntaDirectiva: '', encargado: userId
  })

  const [invitados, setInvitados] = useState<Invitado[]>([])
  const [agendaDtos, setAgendaDtos] = useState<AgendaPunto[]>([])
  const [juntaMiembros, setJuntaMiembros] = useState<JuntaMiembro[]>([])
  const [notificationMessage, setNotificationMessage] = useState<string>('')

  const [error, setError] = useState<string>('')
  const [guardado, setGuardado] = useState<boolean>(false)
  const [enviando, setEnviando] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return
    fetch('http://localhost:3000/api/junta-directiva', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        setInfoData(f => ({ ...f, juntaDirectiva: data.id }))
        setJuntaMiembros(data.miembrosData || [])
      })
      .catch(err => console.error('Error cargando junta:', err))
  }, [])

  const handleInfoChange = (field: keyof InfoData, value: any) => {
    setInfoData(f => ({
      ...f,
      [field]: value,
      ...(field === 'modalidad' && value === 'Presencial' ? { plataforma: null } : {})
    }))
  }

  const addInvitado = (nombre: string, correo: string) => {
    if (!nombre || !correo) return
    setInvitados(curr => [...curr, { nombre, correo }])
  }
  const removeInvitado = (idx: number) => setInvitados(curr => curr.filter((_, i) => i !== idx))

  const addAgendaItem = () => {
    setAgendaDtos(curr => [
      ...curr,
      { titulo: '', orden: curr.length + 1, expositor: '', tipo: 'informacion', duracion: 0 ,enlaceUrl: '', enlaceTexto: '' }
    ])
  }

  const updateAgendaItem = (idx: number, field: keyof AgendaPunto, value: any) => {
    setAgendaDtos(curr => {
      const list = [...curr]
      list[idx] = {
        ...list[idx],
        [field]: (field === 'orden' || field === 'duracion') ? Number(value) : value
      }
      return list
    })
  }

  const programarAgenda = async () => {
    if (invitados.length === 0) { alert('Agrega al menos un invitado.'); setActiveTab('asistentes'); return }
    if (agendaDtos.length === 0) { alert('Agrega al menos un punto de agenda.'); setActiveTab('agenda'); return }
    if (agendaDtos.some(i => !i.expositor)) { alert('Asigna expositor a cada punto.'); setActiveTab('agenda'); return }

    const token = localStorage.getItem('authToken')
    if (!token) { alert('No autenticado'); return }

    const payload = {
      tipo: infoData.tipo,
      fecha: infoData.fecha,
      hora: infoData.hora,
      modalidad: infoData.modalidad,
      juntaDirectiva: infoData.juntaDirectiva,
      encargado: infoData.encargado,
      invitados: invitados.map(inv => ({ nombre: inv.nombre, correo: inv.correo })),
      agendaDtos: agendaDtos.map(item => ({
        titulo: item.titulo,
        orden: item.orden,
        expositor: item.expositor,     
        tipo:      item.tipo,
        duracion: item.duracion,
        ...(item.tipo === 'estrategico' && item.responsable
        ? { responsable: item.responsable }
        : {}),
        ...(item.enlaceUrl     ? { enlaceUrl: item.enlaceUrl     } : {}),
        ...(item.enlaceTexto  ? { enlaceTexto: item.enlaceTexto } : {})
      }))
    }

    try {
      const res = await fetch('http://localhost:3000/api/sesiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || res.statusText)
      }
      navigate('/dashboard')
    } catch (err: any) {
      alert('Error guardando: ' + err.message)
    }
  }

  const generarPdf = (): string => {
    const doc = new jsPDF()
    const W = doc.internal.pageSize.getWidth()
    const marginX = 20
    let y = 20

    const fechaStr = new Date(infoData.fecha).toLocaleDateString('es-CR', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    doc.text(
      `Sesión ${infoData.tipo.toLowerCase() === 'ordinaria' ? 'Ordinaria' : 'Extraordinaria'} realizada el ${fechaStr}, a las ${infoData.hora}, en ${infoData.ubicacion}.`,
      marginX, y
    )
    y += 12

    const storedName = localStorage.getItem('userName') || ''
    const storedLast = localStorage.getItem('userLastName') || ''
    const encargadoNombre = `${storedName} ${storedLast}`.trim() || '—'
    doc.setFont(undefined, 'bold')
    doc.text('Preside la Sesión', marginX, y); y += 6
    doc.setFont(undefined, 'normal')
    doc.text(encargadoNombre, marginX, y); y += 12

    doc.setFont(undefined, 'bold')
    doc.text('Junta Directiva:', marginX, y); y += 6
    doc.setFont(undefined, 'normal')
    juntaMiembros.forEach(m => {
      doc.text(`- ${m.name} ${m.lastName}`, marginX + 4, y)
      y += 6
    })
    y += 8

    if (invitados.length) {
      doc.setFont(undefined, 'bold')
      doc.text('Invitados:', marginX, y); y += 6
      doc.setFont(undefined, 'normal')
      invitados.forEach(inv => {
        doc.text(`- ${inv.nombre}`, marginX + 4, y)
        y += 6
      })
      y += 8
    }

    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('AGENDA DE PUNTOS CONSULTADOS', W/2, y, { align: 'center' })
    y += 8
    doc.setFontSize(12)
    doc.text('(PUNTO ÚNICO)', W/2, y, { align: 'center' })
    y += 12

    agendaDtos.forEach((item, idx) => {
      if (y > 270) { doc.addPage(); y = 20 }

      doc.setFont(undefined, 'bold')
      const title = `${idx+1}. ${item.titulo}`
      doc.text(title, marginX, y)
      y += 6

      if (item.enlaceUrl) {
        const label = item.enlaceTexto?.trim() || 'Ver documento'
        doc.setTextColor(0, 0, 255)
        doc.setFontSize(11)
        doc.text(label, marginX, y)
        const wLink = doc.getTextWidth(label)
        doc.link(marginX, y - 2, wLink, 8, { url: item.enlaceUrl })
        doc.setTextColor(0, 0, 0)
        y += 10
        doc.setFontSize(12)
      }

      const miembro = juntaMiembros.find(m => m._id === item.expositor)
      const expositorName = miembro
        ? `${miembro.name} ${miembro.lastName}`
        : item.expositor

      doc.setFont(undefined, 'normal')
      doc.text(`   • Expositor: ${expositorName}`, marginX, y); y += 5
      doc.text(`   • Duración: ${item.duracion} min`, marginX, y); y += 5
      const tipoMap: Record<PuntoTipo, string> = {
        informacion: 'Información',
        votacion:    'Votación',
        estrategico: 'Estratégico',
        varios:      'Varios'
      }
      doc.text(`   • Tipo: ${tipoMap[item.tipo]}`, marginX, y); y += 10
    })

    doc.save('agenda.pdf')
    const base64 = doc.output('dataurlstring').split(',')[1]
    return `data:application/pdf;base64,${base64}`
  }


  const enviarCorreo = async (pdfBase64: string) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No autenticado')

    const inicio = new Date(`${infoData.fecha}T${infoData.hora}`)
    type Especial = { inv: Invitado; item: AgendaPunto; horaEstim: string }
    const especiales = agendaDtos
      .map(item => {
        const inv = invitados.find(i => i.nombre === item.expositor)
        if (!inv) return null
        const prevMin = agendaDtos
          .filter(p => p.orden < item.orden)
          .reduce((sum,p) => sum + p.duracion, 0)
        const horaEstim = new Date(inicio.getTime() + prevMin*60000)
          .toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'})
        return { inv, item, horaEstim }
      })
      .filter((x): x is Especial => !!x)

    for (const { inv, item, horaEstim } of especiales) {
      let cuerpo = `
  Estimado(a) ${inv.nombre},

  Se le invita a exponer el punto:
  "${item.titulo}"
  `
      if (item.enlaceUrl) {
        cuerpo += `Enlace al documento: ${item.enlaceTexto || 'Ver documento'}\n${item.enlaceUrl}\n\n`
      }
      cuerpo += `
  Fecha: ${new Date(infoData.fecha).toLocaleDateString('es-CR',{year:'numeric',month:'long',day:'numeric'})}
  Hora estimada: ${horaEstim}
  Duración: ${item.duracion} min

  No es necesario que permanezca toda la sesión.
  Saludos.
  `.trim()

      await emailjs.send(
        'service_i73yyoi',
        'template_0ddie3x',
        { email: inv.correo, subject: 'Convocatoria específica', message: cuerpo, attachment: pdfBase64 },
        'PAk_0pLu4r-tPDVue'
      )
    }

    // 2) Convocatoria general para Junta + resto de invitados
    const emailsJunta = juntaMiembros.map(m => m.email)
    const others = invitados
      .filter(inv => !especiales.some(e => e.inv.correo === inv.correo))
      .map(inv => inv.correo)
    const generalList = Array.from(new Set([...emailsJunta, ...others]))

    // Construir resumen con link si existe
    const resumen = agendaDtos.map((item, idx) => {
      const miembro = juntaMiembros.find(m => `${m.name} ${m.lastName}` === item.expositor)
      const name = miembro ? `${miembro.name} ${miembro.lastName}` : item.expositor
      let line = `${idx+1}. ${item.titulo} — ${item.duracion} min — Expositor: ${name}`
      if (item.enlaceUrl) {
        line += ` — ${item.enlaceTexto || 'Ver documento'}: ${item.enlaceUrl}`
      }
      return line
    }).join('\n')

    const fechaStr2 = new Date(infoData.fecha).toLocaleDateString('es-CR',{year:'numeric',month:'long',day:'numeric'})
    const cuerpoGen = `
  Estimado(a),

  Por medio del presente se le convoca a la sesión del ${fechaStr2} a las ${infoData.hora} en ${infoData.ubicacion}.

  Agenda:
  ${resumen}

  Saludos cordiales.
  `.trim()

    for (const email of generalList) {
      await emailjs.send(
        'service_i73yyoi',
        'template_0ddie3x',
        { email, subject: 'Convocatoria sesión', message: cuerpoGen, attachment: pdfBase64 },
        'PAk_0pLu4r-tPDVue'
      )
    }
  }

  const handleGuardarYEnviar = async () => {
    setError('');
    setGuardado(false);

    if (agendaDtos.length === 0) {
      setError('Debes agregar al menos un punto de agenda.');
      setActiveTab('agenda');
      return;
    }

    if (invitados.length === 0 && juntaMiembros.length === 0) {
      setError('No hay invitados ni miembros de Junta a quienes notificar.');
      setActiveTab('asistentes');
      return;
    }

    setEnviando(true);
    try {
      const pdfBase64 = generarPdf();
      await enviarCorreo(pdfBase64);
      setGuardado(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error desconocido');
    } finally {
      setEnviando(false);
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <button onClick={() => navigate(-1)} className="text-gray-600">← Volver</button>
        <h1 className="text-2xl font-semibold">Crear Nueva Sesión</h1>
        <div style={{ width: 60 }} />
      </header>

      <nav className="flex border-b bg-white">
        {(['info', 'asistentes', 'agenda', 'notificacion'] as TabKey[]).map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {{
              info: 'Información Básica',
              asistentes: 'Invitados',
              agenda: 'Puntos de Agenda',
              notificacion: 'Notificación'
            }[key]}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-auto p-6">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Información básica */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Tipo</label>
                <select
                  value={infoData.tipo}
                  onChange={e => handleInfoChange('tipo', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option value="ORDINARIA">ORDINARIA</option>
                  <option value="EXTRAORDINARIA">EXTRAORDINARIA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Modalidad</label>
                <select
                  value={infoData.modalidad}
                  onChange={e => handleInfoChange('modalidad', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option>Híbrida</option>
                  <option>Presencial</option>
                  <option>Virtual</option>
                </select>
              </div>
            </div>

            {/* Fecha / Hora / Ubicación */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  value={infoData.fecha}
                  onChange={e => handleInfoChange('fecha', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Hora</label>
                <input
                  type="time"
                  value={infoData.hora}
                  onChange={e => handleInfoChange('hora', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Ubicación</label>
                <input
                  type="text"
                  value={infoData.ubicacion}
                  onChange={e => handleInfoChange('ubicacion', e.target.value)}
                  placeholder="Salón 101, ..."
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Plataforma solo para Virtual/Híbrida */}
            {(infoData.modalidad === 'Virtual' || infoData.modalidad === 'Híbrida') && (
              <div>
                <label className="block text-sm font-medium">Plataforma</label>
                <select
                  value={infoData.plataforma || ''}
                  onChange={e => handleInfoChange('plataforma', e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option value="">-- Seleccione --</option>
                  {['Zoom', 'Google Meet', 'Teams'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {activeTab === 'asistentes' && (
          <div className="space-y-4">
            {/* Lista de invitados */}
            {invitados.map((inv, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <span>{inv.nombre} ({inv.correo})</span>
                <button onClick={() => removeInvitado(idx)} className="text-red-500 hover:underline">
                  Eliminar
                </button>
              </div>
            ))}

            {/* Formulario agregar invitado */}
            <div className="grid grid-cols-2 gap-4">
              <input id="nombreInv" placeholder="Nombre" className="border rounded px-3 py-2" />
              <input id="correoInv" placeholder="correo@ejemplo.com" className="border rounded px-3 py-2" />
            </div>
            <button
              onClick={() => {
                const nom = (document.getElementById('nombreInv') as HTMLInputElement).value
                const cor = (document.getElementById('correoInv') as HTMLInputElement).value
                addInvitado(nom, cor)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              + Agregar Invitado
            </button>
          </div>
        )}

        {activeTab==='agenda' && (
          <div className="space-y-6">
            {agendaDtos.map((item, idx)=>(
              <div key={idx} className="border p-4 rounded-lg space-y-3">
                {/* Orden/Título */}
                {/* Tipo */}
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <span className="text-sm">Orden:</span>
                    <input type="number" value={item.orden} onChange={e=>updateAgendaItem(idx,'orden',e.target.value)}
                      className="w-16 border rounded px-2 py-1"/>
                  </label>
                  <label className="flex-1 flex items-center space-x-2">
                    <span className="text-sm">Título:</span>
                    <input type="text" value={item.titulo} onChange={e=>updateAgendaItem(idx,'titulo',e.target.value)}
                      className="w-full border rounded px-3 py-2"/>
                  </label>
                </div>
                {/* Tipo/Expositor/Duración */}
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="block text-sm">Tipo:</label>
                    <select value={item.tipo} onChange={e=>updateAgendaItem(idx,'tipo',e.target.value)}
                      className="border rounded px-3 py-2">
                      <option value="informacion">Información</option>
                      <option value="votacion">Votación</option>
                      <option value="estrategico">Estratégico</option>
                      <option value="varios">Varios</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm">Expositor:</label>
                    <select value={item.expositor} onChange={e=>updateAgendaItem(idx,'expositor',e.target.value)}
                      className="border rounded px-3 py-2" required>
                      <option value="" disabled>-- Seleccione expositor --</option>
                      {juntaMiembros.map(m=><option key={m._id} value={`${m.name} ${m.lastName}`}>{m.name} {m.lastName}</option>)}
                      {invitados.map(inv=><option key={inv.correo} value={inv.nombre}>{inv.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm">Duración (min):</label>
                    <input type="number" value={item.duracion} onChange={e=>updateAgendaItem(idx,'duracion',e.target.value)}
                      className="w-20 border rounded px-2 py-1" />
                  </div>

                  {/* URL del documento */}
                  <div>
                    <label className="block text-sm font-medium">Enlace (URL)</label>
                    <input
                      type="url"
                      value={item.enlaceUrl || ''}
                      onChange={e => updateAgendaItem(idx, 'enlaceUrl', e.target.value)}
                      className="w-full border rounded px-3 py-2 mb-2"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Texto del hipervínculo */}
                  <div>
                    <label className="block text-sm font-medium">Texto del enlace</label>
                    <input
                      type="text"
                      value={item.enlaceTexto || ''}
                      onChange={e => updateAgendaItem(idx, 'enlaceTexto', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Nombre para el enlace"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addAgendaItem} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              + Agregar punto de agenda
            </button>
          </div>
        )}

        {activeTab === 'notificacion' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Mensaje de Notificación</label>
            <textarea
              value={notificationMessage}
              onChange={e => setNotificationMessage(e.target.value)}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Escribe el mensaje a enviar..."
            />
          </div>
        )}
      </main>

      <footer className="px-6 py-4 bg-white text-right">
        <button onClick={async () => {await programarAgenda(); await handleGuardarYEnviar();}}className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          Programar Agenda
        </button>
      </footer>
    </div>
  )
}

export default CreateSessionPage