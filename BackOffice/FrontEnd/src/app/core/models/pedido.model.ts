export interface Pedido {
  id: string;
  clienteNombre: string;
  archivos: Archivo[];
  estado: EstadoPedido;
  fechaCreacion: Date;
  fechaCompletado?: Date;
  comprobantePago?: string;
  clienteTelefono?: string;
  observaciones?: string;
}

export interface Archivo {
  nombre: string;
  url: string;
  tamano: number;
  tipo: string;
}

export type EstadoPedido = 'pendiente' | 'procesando' | 'listo' | 'completado';


export interface WhatsAppLinkResponse {
  link: string;
}
