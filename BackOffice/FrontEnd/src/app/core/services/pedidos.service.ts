import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Pedido, EstadoPedido } from '../models/pedido.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  public readonly isLoading = signal(false);

  // Mock data para desarrollo
  private mockPedidos: Pedido[] = [
    {
      id: '1',
      clienteNombre: 'Juan Pérez',
      archivos: [
        {
          nombre: 'documento1.pdf',
          url: 'https://drive.google.com/file/d/1ABC123/view',
          tamano: 2048576,
          tipo: 'application/pdf',
        },
        {
          nombre: 'imagen1.jpg',
          url: 'https://drive.google.com/file/d/2DEF456/view',
          tamano: 1048576,
          tipo: 'image/jpeg',
        },
      ],
      estado: 'pendiente',
      fechaCreacion: new Date('2024-01-15T10:30:00'),
      telefonoCliente: '+5491112345678',
      observaciones: 'Imprimir en color, 2 copias',
    },
    {
      id: '2',
      clienteNombre: 'María González',
      archivos: [
        {
          nombre: 'presentacion.pptx',
          url: 'https://drive.google.com/file/d/3GHI789/view',
          tamano: 5242880,
          tipo: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        },
      ],
      estado: 'procesando',
      fechaCreacion: new Date('2024-01-15T09:15:00'),
      telefonoCliente: '+5491187654321',
      observaciones: 'Imprimir en blanco y negro, 1 copia',
    },
    {
      id: '3',
      clienteNombre: 'Carlos López',
      archivos: [
        {
          nombre: 'trabajo_final.docx',
          url: 'https://drive.google.com/file/d/4JKL012/view',
          tamano: 1572864,
          tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      ],
      estado: 'listo',
      fechaCreacion: new Date('2024-01-14T16:45:00'),
      telefonoCliente: '+5491155555555',
      observaciones: 'Imprimir en color, 3 copias',
    },
  ];

  constructor(private http: HttpClient) {}

  getPedidosPendientes(): Observable<Pedido[]> {
    this.isLoading.set(true);

    return of(this.mockPedidos.filter(p => p.estado === 'pendiente')).pipe(
      delay(800), // Simular delay de red
      map(pedidos => {
        this.isLoading.set(false);
        return pedidos;
      })
    );
  }

  getPedidosCompletados(): Observable<Pedido[]> {
    this.isLoading.set(true);

    return of(this.mockPedidos.filter(p => p.estado === 'listo' || p.estado === 'completado')).pipe(
      delay(800),
      map(pedidos => {
        this.isLoading.set(false);
        return pedidos;
      })
    );
  }

  marcarComoListo(id: string): Observable<void> {
    this.isLoading.set(true);

    const pedido = this.mockPedidos.find(p => p.id === id);
    if (pedido) {
      pedido.estado = 'listo';
      pedido.fechaCompletado = new Date();
    }

    return of(void 0).pipe(
      delay(1000),
      map(() => {
        this.isLoading.set(false);
      })
    );
  }

  getWhatsAppLink(id: string): Observable<{ link: string }> {
    const pedido = this.mockPedidos.find(p => p.id === id);
    if (!pedido?.telefonoCliente) {
      return throwError(() => new Error('No se encontró teléfono del cliente'));
    }

    const phoneNumber = pedido.telefonoCliente.replace('+', '');
    const message = encodeURIComponent(
      `Hola ${pedido.clienteNombre}, tu pedido #${id} está listo para retirar.`
    );
    const link = `${environment.whatsappBaseUrl}${phoneNumber}?text=${message}`;

    return of({ link });
  }

  // Método para simular actualización automática
  refreshPedidos(): Observable<Pedido[]> {
    return of(this.mockPedidos.filter(p => p.estado === 'pendiente')).pipe(delay(500));
  }
}
