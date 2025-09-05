import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pedido, EstadoPedido, WhatsAppLinkResponse } from '../models/pedido.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  public readonly isLoading = signal(false);

  constructor(private http: HttpClient) {}

  getPedidosPendientes(): Observable<Pedido[]> {
    this.isLoading.set(true);
    return this.http.get<any[]>(`${environment.apiUrl}/orders`).pipe(
      map((orders) => {
        this.isLoading.set(false);
        return orders.map((o) => ({
          id: o.id,
          clienteNombre: o.clienteNombre,
          archivos: o.archivos?.map((a: any) => ({ nombre: a.nombre, url: a.urlDrive })),
          estado: (o.estado?.toLowerCase() as EstadoPedido),
          fechaCreacion: o.createdAt,
          telefonoCliente: o.clienteTelefono,
        }));
      })
    );
  }

  refreshPedidos(): Observable<Pedido[]> {
    return this.getPedidosPendientes();
  }

  marcarComoListo(id: string): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/orders/${id}/ready`, {});
  }

  getWhatsAppLink(id: string, phone?: string): Observable<WhatsAppLinkResponse> {
    const params = phone ? { phone } : {} as any;
    return this.http.get<WhatsAppLinkResponse>(`${environment.apiUrl}/orders/${id}/whatsapp-link`, { params });
  }
}
