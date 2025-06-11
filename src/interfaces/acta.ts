export interface Acta {
    id: number;
    codigo: string;
    titulo: string;
    fechaCreacion: string;
    fechaSesion: string;
    creador: string;
    estado: 'borrador' | 'cerrada' | 'pendiente';
    contenido: string;
    pdfUrl?: string;
  }
  
  export interface CreateActaDto {
    titulo: string;
    fechaSesion: string;
    contenido: string;
  }
  
  export interface UpdateActaDto {
    titulo?: string;
    fechaSesion?: string;
    contenido?: string;
    estado?: 'borrador' | 'cerrada' | 'pendiente';
  }