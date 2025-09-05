import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { Pedido } from '../models/pedido.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  public readonly isLoading = signal(false);

  constructor(private http: HttpClient) {}

  private mapPedido(order: any): Pedido {
    return {
      id: order.id,
      clienteNombre: order.clienteNombre,
      archivos: (order.archivos || []).map((a: any) => ({
        nombre: a.nombre,
        url: a.urlDrive,
        tamano: 0,
        tipo: '',
      })),
      estado: order.estado?.toLowerCase(),
      fechaCreacion: order.createdAt,
      telefonoCliente: order.clienteTelefono,
    } as Pedido;
  }

  getPedidosPendientes(): Observable<Pedido[]> {
    this.isLoading.set(true);
    return this.http.get<any[]>(`${environment.apiUrl}/orders`).pipe(
      map((orders) => orders.map((o) => this.mapPedido(o))),
      finalize(() => this.isLoading.set(false)),
    );
  }

  getPedidosCompletados(): Observable<Pedido[]> {
    this.isLoading.set(true);
    return this.http.get<any[]>(`${environment.apiUrl}/orders/all`).pipe(
      map((orders) => orders.map((o) => this.mapPedido(o))),
      finalize(() => this.isLoading.set(false)),
    );
  }

  marcarComoListo(id: string): Observable<void> {
    this.isLoading.set(true);
    return this.http
      .patch<void>(`${environment.apiUrl}/orders/${id}/ready`, {})
      .pipe(finalize(() => this.isLoading.set(false)));
  }

  getWhatsAppLink(id: string, phone?: string): Observable<{ link: string }> {
    const params = phone ? { params: { phone } } : {};
    return this.http.get<{ link: string }>(
      `${environment.apiUrl}/orders/${id}/whatsapp-link`,
      params,
    );
  }

  // Método para actualización automática
  refreshPedidos(): Observable<Pedido[]> {
    return this.getPedidosPendientes();
  }
}
