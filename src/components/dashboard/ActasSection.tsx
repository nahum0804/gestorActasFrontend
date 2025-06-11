import React from 'react';
import type { Acta } from '../../interfaces/acta';

interface ActasSectionProps {
  actas: Acta[];
  onBack: () => void;
  onDownloadPdf: (id: number) => void;
  loading: boolean;
}

const ActasSection: React.FC<ActasSectionProps> = ({ 
  actas, 
  onBack, 
  onDownloadPdf,
  loading 
}) => {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        ← Volver
      </button>

      <h2 className="text-xl font-semibold">Actas creadas</h2>

      {loading ? (
        <p>Cargando actas...</p>
      ) : actas.length === 0 ? (
        <p>No hay actas registradas</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Código</th>
                <th className="py-2 px-4 border">Título</th>
                <th className="py-2 px-4 border">Fecha de creación</th>
                <th className="py-2 px-4 border">Estado</th>
                <th className="py-2 px-4 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {actas.map((acta) => (
                <tr key={acta.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{acta.id}</td>
                  <td className="py-2 px-4 border">{acta.codigo}</td>
                  <td className="py-2 px-4 border">{acta.titulo}</td>
                  <td className="py-2 px-4 border">{new Date(acta.fechaCreacion).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      acta.estado === 'cerrada' 
                        ? 'bg-green-100 text-green-800' 
                        : acta.estado === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {acta.estado}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    {acta.estado === 'cerrada' ? (
                      <button
                        onClick={() => onDownloadPdf(acta.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Descargar PDF
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        {acta.estado === 'borrador' ? 'Editar' : 'En proceso...'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActasSection;