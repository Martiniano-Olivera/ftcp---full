import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pedido, EstadoPedido, WhatsAppLinkResponse } from '../models/pedido.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private readonly apiUrl = environment.apiUrl;
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
      estado: (order.estado || '').toLowerCase() as EstadoPedido,
      fechaCreacion: new Date(order.createdAt),
      telefonoCliente: order.clienteTelefono,
      observaciones: undefined,
    };
  }

  getPedidosPendientes(): Observable<Pedido[]> {
    this.isLoading.set(true);
    return this.http.get<any[]>(`${this.apiUrl}/orders`).pipe(
      map((orders) => orders.map((o) => this.mapPedido(o))),
      map((pedidos) => {
        this.isLoading.set(false);
        return pedidos;
      }),
    );
  }

  refreshPedidos(): Observable<Pedido[]> {
    return this.getPedidosPendientes();
  }

  marcarComoListo(id: string): Observable<void> {
    this.isLoading.set(true);
    return this.http
      .patch<void>(`${this.apiUrl}/orders/${id}/ready`, {})
      .pipe(
        map(() => {
          this.isLoading.set(false);
        }),
      );
  }

  getWhatsAppLink(id: string, phone?: string): Observable<WhatsAppLinkResponse> {
    let params = new HttpParams();
    if (phone) {
      params = params.set('phone', phone);
    }
    return this.http.get<WhatsAppLinkResponse>(
      `${this.apiUrl}/orders/${id}/whatsapp-link`,
      { params },
    );
  }
}
