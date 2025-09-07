import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Pedido, WhatsAppLinkResponse } from '../models/pedido.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  public readonly isLoading = signal(false);

  constructor(private http: HttpClient) {}

  getPending(): Observable<Pedido[]> {
    this.isLoading.set(true);
    return this.http
      .get<Pedido[]>(`${environment.apiUrl}/orders`)
      .pipe(finalize(() => this.isLoading.set(false)));
  }

  getPedidosCompletados(): Observable<Pedido[]> {
    this.isLoading.set(true);
    return this.http
      .get<Pedido[]>(`${environment.apiUrl}/orders/all`)
      .pipe(finalize(() => this.isLoading.set(false)));
  }

  marcarComoListo(id: string): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/orders/${id}/ready`, {});
  }

  getWhatsAppLink(id: string, phone?: string): Observable<WhatsAppLinkResponse> {
    let params = new HttpParams();
    if (phone) {
      params = params.set('phone', phone);
    }
    return this.http.get<WhatsAppLinkResponse>(
      `${environment.apiUrl}/orders/${id}/whatsapp-link`,
      { params }
    );
  }

  refreshPedidos(): Observable<Pedido[]> {
    return this.getPending();
  }
}
