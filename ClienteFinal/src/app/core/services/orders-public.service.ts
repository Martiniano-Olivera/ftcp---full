import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PublicOrder {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  archivos: { nombre: string; url: string }[];
}

@Injectable({ providedIn: 'root' })
export class OrdersPublicService {
  constructor(private http: HttpClient) {}

  submitOrder(input: {
    nombre: string;
    telefono: string;
    files: File[];
  }): Observable<PublicOrder> {
    const fd = new FormData();
    fd.set('clienteNombre', input.nombre);
    fd.set('clienteTelefono', input.telefono);
    for (const f of input.files) fd.append('files', f, f.name);
    return this.http
      .post<PublicOrder>(`${environment.apiUrl}/public/orders`, fd, {
        observe: 'response',
      })
      .pipe(map(r => r.body as PublicOrder));
  }
}
