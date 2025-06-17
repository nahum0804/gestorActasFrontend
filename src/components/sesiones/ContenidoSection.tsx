import React from 'react'
import type { FC } from 'react'

interface ContenidoProps {
  markDirty: () => void
}

const ContenidoSection: FC<ContenidoProps> = ({ markDirty }) => (
  <section className="bg-white p-6 rounded shadow">
    <label className="block mb-2 font-medium">Contenido del Acta</label>
    <textarea
      onChange={markDirty}
      className="w-full h-40 border rounded px-3 py-2 focus:outline-none"
      placeholder="Aquí va el contenido o editor WYSIWYG…"
    />
  </section>
)

export default ContenidoSection
