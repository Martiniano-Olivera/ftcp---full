export interface Pedido {
  id: string;
  clienteNombre: string;
  archivos: Archivo[];
  estado: EstadoPedido;
  fechaCreacion: Date;
  fechaCompletado?: Date;
  comprobantePago?: string;
  telefonoCliente?: string;
  observaciones?: string;
}

export interface Archivo {
  nombre: string;
  url: string;
  tamano: number;
  tipo: string;
}

export type EstadoPedido = 'pendiente' | 'procesando' | 'listo' | 'completado';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface WhatsAppLinkResponse {
  link: string;
}
