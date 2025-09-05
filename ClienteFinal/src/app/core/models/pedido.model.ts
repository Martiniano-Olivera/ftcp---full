export interface Archivo {
  id: string;
  nombre: string;
  tamano: number;
  tipo: string;
  fechaSubida: Date;
}

export interface OpcionesImpresion {
  tipoImpresion: 'simple' | 'doble';
  cantidad: number;
  color: boolean;
  tamanoPapel: 'A4' | 'A3' | 'Carta';
  orientacion: 'vertical' | 'horizontal';
}

export interface Pedido {
  id: string;
  archivos: Archivo[];
  opciones: OpcionesImpresion;
  precioEstimado: number;
  fechaCreacion: Date;
  estado: 'borrador' | 'confirmado' | 'pagado' | 'completado';
}
