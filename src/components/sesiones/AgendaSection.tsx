import React, { useState } from 'react'
import type { FC } from 'react'
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'

export type Punto = {
  id: number
  titulo: string
  descripcion: string
  tiempo: number
  presentador: string
  archivo?: File
  votacion?: boolean   // <-- nueva propiedad
}

interface AgendaProps {
  markDirty: () => void
}

const AgendaSection: FC<AgendaProps> = ({ markDirty }) => {
  const [items, setItems] = useState<Punto[]>([
    { id: 1, titulo: 'Revisión de Acta Anterior', descripcion: '', tiempo: 10, presentador: '', archivo: undefined, votacion: false }
  ])

  const addItem = () => {
    markDirty()
    setItems([
      ...items,
      { id: Date.now(), titulo: '', descripcion: '', tiempo: 0, presentador: '', archivo: undefined, votacion: false }
    ])
  }

  const removeItem = (id: number) => {
    markDirty()
    setItems(items.filter(i => i.id !== id))
  }

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return
    markDirty()
    const arr = [...items]
    const [m] = arr.splice(from, 1)
    arr.splice(to, 0, m)
    setItems(arr)
  }

  const toggleVotation = (idx: number) => {
    markDirty()
    const arr = [...items]
    arr[idx].votacion = !arr[idx].votacion
    setItems(arr)
  }

  return (
    <section className="space-y-6">
      {items.map((item, idx) => (
        <div key={item.id} className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {/* número */}
          <div className="absolute -top-3 left-6 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
            {idx + 1}
          </div>

          {/* título y acciones */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={item.titulo}
              onChange={e => {
                markDirty()
                item.titulo = e.target.value
                setItems([...items])
              }}
              placeholder="Título del punto"
              className="flex-1 border-b border-gray-300 px-2 py-1 focus:outline-none"
            />
            <div className="flex items-center space-x-2 ml-4 text-gray-500">
              <ChevronUp size={16} onClick={() => moveItem(idx, idx - 1)} />
              <ChevronDown size={16} onClick={() => moveItem(idx, idx + 1)} />
              <Trash2 size={16} onClick={() => removeItem(item.id)} />
            </div>
          </div>

          {/* descripción */}
          <textarea
            value={item.descripcion}
            onChange={e => {
              markDirty()
              item.descripcion = e.target.value
              setItems([...items])
            }}
            placeholder="Descripción o notas para este punto"
            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none"
          />

          {/* controles: adjuntar, tiempo, presentador, votación */}
          <div className="flex flex-wrap items-center gap-6">
            {/* adjuntar */}
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <span>Adjuntar documento:</span>
              <input
                type="file"
                onChange={e => {
                  markDirty()
                  item.archivo = e.target.files?.[0]
                  setItems([...items])
                }}
              />
            </label>

            {/* tiempo */}
            <div className="flex items-center space-x-1 text-sm text-gray-700">
              <span>Tiempo:</span>
              <input
                type="number"
                value={item.tiempo}
                onChange={e => {
                  markDirty()
                  item.tiempo = +e.target.value
                  setItems([...items])
                }}
                className="w-16 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
              />
              <span>minutos</span>
            </div>

            {/* presentador */}
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>Presentador:</span>
              <select
                value={item.presentador}
                onChange={e => {
                  markDirty()
                  item.presentador = e.target.value
                  setItems([...items])
                }}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
              >
                <option value="">Seleccionar…</option>
                <option>Juan Pérez</option>
                <option>María Gómez</option>
              </select>
            </div>

            {/* votación */}
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={item.votacion}
                onChange={() => toggleVotation(idx)}
              />
              Requiere votación
            </label>
          </div>
        </div>
      ))}

      {/* botón agregar */}
      <button
        onClick={addItem}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        + Agregar punto de agenda
      </button>
    </section>
  )
}

export default AgendaSection