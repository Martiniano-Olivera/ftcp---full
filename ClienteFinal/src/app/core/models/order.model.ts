export interface OrderFile {
  nombre: string;
  url: string;
}

export interface Order {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  archivos: OrderFile[];
  estado: string;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
}
