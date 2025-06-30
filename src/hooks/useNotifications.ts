import { useEffect, useState } from 'react'
import { io, Socket }          from 'socket.io-client'
import axios                   from 'axios'

interface Notif {
  _id: string
  asunto: string
  contenido: string
  leido: boolean
}

export function useNotifications(
  token: string,
  enabled: boolean = true   // <— nuevo parámetro
) {
  const [notifs, setNotifs] = useState<Notif[]>([])

  useEffect(() => {
    // si no estamos “habilitados” o no hay token, no conectamos nada
    if (!enabled || !token) return

    // 1) Abrir socket sólo por WS
    const socket: Socket = io({
      path: '/socket.io',
      transports: ['websocket'],
      auth: { token },
    })

    socket.on('notification', (n: Notif) => {
      setNotifs(curr => [n, ...curr])
    })

    // 2) Registrar buzón y cargar historial
    axios.post('/api/notificaciones/buzon/register', {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(console.error)

    axios.get<Notif[]>('/api/notificaciones/buzon', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (Array.isArray(res.data)) setNotifs(res.data)
      else setNotifs([])
    })
    .catch(err => {
      console.error('Error cargando buzón', err)
      setNotifs([])
    })

    return () => {
      socket.disconnect()
    }
  }, [token, enabled])

  const markRead = async (id: string) => {
    await axios.patch(
      `/api/notificaciones/buzon/${id}/leido`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setNotifs(ns => ns.map(n => n._id === id ? { ...n, leido: true } : n))
  }

  const remove = async (id: string) => {
    await axios.delete(
      `/api/notificaciones/buzon/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setNotifs(ns => ns.filter(n => n._id !== id))
  }

  const unreadCount = notifs.filter(n => !n.leido).length

  return { notifs, unreadCount, markRead, remove }
}