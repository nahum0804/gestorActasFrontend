// src/components/CreateSessionModal.tsx
import React, { useState } from 'react';

type TabKey = 'info' | 'asistentes' | 'agenda' | 'contenido' | 'notificacion';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('info');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-4xl rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">Crear Nueva Sesión</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Pestañas */}
        <nav className="flex border-b">
          {[
            ['info','Información Básica'],
            ['asistentes','Asistentes'],
            ['agenda','Puntos de Agenda'],
            ['contenido','Contenido del Acta'],
            ['notificacion','Notificación'],
          ].map(([key,label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabKey)}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === key
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Contenido de pestaña */}
        <div className="p-6 max-h-[70vh] overflow-auto">
          {activeTab === 'info'        && <BasicInfoSection />}
          {activeTab === 'asistentes'  && <AsistentesSection />}
          {activeTab === 'agenda'      && <AgendaSection />}
          {activeTab === 'contenido'   && <ContenidoSection />}
          {activeTab === 'notificacion'&& <NotificationSection />}
        </div>
      </div>
    </div>
  );
};

// 1. Información Básica
const BasicInfoSection: React.FC = () => (
  <div className="space-y-4">
    {/* Checks Crear Agenda / Crear Acta */}
    <div className="flex items-center space-x-6">
      <label className="flex items-center">
        <input type="checkbox" className="mr-2" /> Crear Agenda
      </label>
      <label className="flex items-center">
        <input type="checkbox" className="mr-2" /> Crear Acta (borrador)
      </label>
    </div>
    <p className="text-sm text-gray-500">Nota: Normalmente se crean ambos documentos para una sesión.</p>

    {/* Título y Código */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium">Título de la Sesión</label>
        <input type="text" className="mt-1 w-full border rounded px-3 py-2" placeholder="Sesión ordinaria el día ..." />
      </div>
      <div>
        <label className="block text-sm font-medium">Código de Sesión</label>
        <div className="flex space-x-2">
          <select className="border rounded px-3 py-2">
            <option>Sesión Ordinaria (SO)</option>
            <option>Otro...</option>
          </select>
          <input type="text" maxLength={2} className="w-16 border rounded px-2 py-2" placeholder="05" />
          <input type="text" maxLength={4} className="w-20 border rounded px-2 py-2" placeholder="2023" />
        </div>
      </div>
    </div>

    {/* Campos adicionales */}
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium">Organizador</label>
        <input type="text" className="mt-1 w-full border rounded px-3 py-2" placeholder="Marlon Vargas Alvarado" />
      </div>
      <div>
        <label className="block text-sm font-medium">Fecha de la Reunión</label>
        <input type="date" className="mt-1 w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Hora de la Reunión</label>
        <input type="time" className="mt-1 w-full border rounded px-3 py-2" />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium">Tipo de Reunión</label>
        <select className="mt-1 w-full border rounded px-3 py-2">
          <option>Híbrido</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Ubicación</label>
        <input type="text" className="mt-1 w-full border rounded px-3 py-2" placeholder="San José" />
      </div>
      <div>
        <label className="block text-sm font-medium">Plataforma</label>
        <select className="mt-1 w-full border rounded px-3 py-2">
          <option>Zoom</option>
        </select>
      </div>
    </div>
  </div>
);

// 2. Asistentes (ya lo tenías, lo puedes reutilizar)
const AsistentesSection: React.FC = () => (
  <div className="space-y-4">
    {/* Lista fija */}
    <div className="space-y-2">
      {/* Reemplaza por tu array real */}
      {['Marlon Vargas Alvarado','Jose Altamirano Rivera','Anthony Quesada Alfaro'].map((name) => (
        <label key={name} className="flex items-center">
          <input type="checkbox" className="mr-2" />
          {name}
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {name.includes('Anthony') ? 'Estudiante' : 'Profesor'}
          </span>
        </label>
      ))}
    </div>
    <hr/>
    {/* Agregar nuevo */}
    <div className="flex space-x-2">
      <input type="text" placeholder="Nombre" className="flex-1 border rounded px-3 py-2" />
      <input type="email" placeholder="ejemplo@ejemplo.com" className="flex-1 border rounded px-3 py-2" />
      <select className="border rounded px-3 py-2">
        <option>Otro</option>
        <option>Profesor</option>
        <option>Estudiante</option>
      </select>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded">+ Agregar</button>
    </div>
    {/* Registro de asistencia */}
    <div className="space-x-2">
      {['Todos Presentes','Todos Ausentes','Personalizado'].map((btn) => (
        <button key={btn} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">{btn}</button>
      ))}
    </div>
  </div>
);

// 3. Puntos de Agenda
type Punto = { id: number; titulo: string; descripcion: string; tiempo: number; presentador: string; archivo?: File };
const AgendaSection: React.FC = () => {
  const [items, setItems] = useState<Punto[]>([
    { id: 1, titulo: 'Revisión de Acta Anterior', descripcion:'', tiempo:10, presentador:'', archivo: undefined }
  ]);
  const addItem = () => setItems([...items, { id: Date.now(), titulo:'', descripcion:'', tiempo:0, presentador:'', archivo:undefined }]);
  const remove = (id:number)=> setItems(items.filter(i=>i.id!==id));
  const move = (from:number, to:number) => {
    const arr = [...items];
    const [m] = arr.splice(from,1);
    arr.splice(to,0,m);
    setItems(arr);
  };

  return (
    <div className="space-y-6">
      {items.map((item, idx) => (
        <div key={item.id} className="border p-4 rounded-lg relative">
          <div className="flex items-center mb-2">
            <span className="font-semibold mr-2">{idx+1}.</span>
            <input
              type="text"
              value={item.titulo}
              onChange={e=>{ item.titulo = e.target.value; setItems([...items]); }}
              placeholder="Título del punto"
              className="flex-1 border-b px-2 py-1"
            />
            <div className="flex ml-2 space-x-1">
              <button disabled={idx===0} onClick={()=>move(idx,idx-1)}>↑</button>
              <button disabled={idx===items.length-1} onClick={()=>move(idx,idx+1)}>↓</button>
              <button onClick={()=>remove(item.id)}>🗑</button>
            </div>
          </div>
          <textarea
            value={item.descripcion}
            onChange={e=>{ item.descripcion=e.target.value; setItems([...items]); }}
            placeholder="Descripción o notas para este punto"
            className="w-full border rounded px-3 py-2 mb-3"
          />
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              Adjuntar documento:
              <input
                type="file"
                onChange={e=>{ item.archivo = e.target.files?.[0]; setItems([...items]); }}
                className="block mt-1"
              />
            </label>
            <div>
              <label className="block text-sm">Tiempo:</label>
              <input
                type="number"
                value={item.tiempo}
                onChange={e=>{ item.tiempo=+e.target.value; setItems([...items]); }}
                className="w-20 border rounded px-2 py-1"
              /> min
            </div>
            <div>
              <label className="block text-sm">Presentador:</label>
              <select
                value={item.presentador}
                onChange={e=>{ item.presentador=e.target.value; setItems([...items]); }}
                className="border rounded px-3 py-2"
              >
                <option value="">Seleccionar…</option>
                <option>Juan Pérez</option>
                <option>María Gómez</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      <button onClick={addItem} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        + Agregar punto de agenda
      </button>
    </div>
  );
};

// 4. Contenido del Acta (puedes personalizar)
const ContenidoSection: React.FC = () => (
  <div>
    <p>Aquí iría el editor de texto o plantillas para el contenido del acta.</p>
    {/* Podrías usar un <textarea> o un WYSIWYG como react-quill */}
  </div>
);

// 5. Notificación
const NotificationSection: React.FC = () => {
  const [sendNow, setSendNow] = useState(true);
  const [reminder24, setReminder24] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Mensaje de la Convocatoria</label>
        <input
          type="text"
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Confirmar asistencia."
        />
      </div>
      <div className="space-y-2">
        <label className="flex items-center">
          <input type="checkbox" checked={sendNow} onChange={()=>setSendNow(!sendNow)} className="mr-2" />
          Enviar notificación inmediatamente
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={reminder24} onChange={()=>setReminder24(!reminder24)} className="mr-2" />
          Enviar recordatorio 24 horas antes
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={scheduled} onChange={()=>setScheduled(!scheduled)} className="mr-2" />
          Programar Notificación
          {scheduled && (
            <>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="ml-2 border rounded px-2 py-1"/>
              <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="border rounded px-2 py-1"/>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Programar</button>
            </>
          )}
        </label>
      </div>
      <div>
        <p className="font-medium">Destinatarios de la Notificación</p>
        <ul className="mt-2 space-y-1">
          {['Marlon Vargas Alvarado','Jose Altamirano Riviera','Anthony Quesada Alfaro'].map(name=>(
            <li key={name} className="flex justify-between border-b py-1">
              <span>{name}</span>
              <span className="text-gray-500 text-sm">{name.split(' ')[1].toLowerCase()}@example.com</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="mr-2" />
          Vista previa del correo
        </label>
      </div>
    </div>
  );
};
