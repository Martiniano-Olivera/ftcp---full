import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersPublicService {
  constructor(private http: HttpClient) {}

  submitOrder(form: {
    nombre: string;
    telefono: string;
    files: File[];
  }): Observable<Order> {
    const fd = new FormData();
    fd.append('clienteNombre', form.nombre);
    fd.append('clienteTelefono', form.telefono);
    form.files.forEach(f => fd.append('files', f, f.name));
    return this.http.post<Order>(`${environment.apiUrl}/public/orders`, fd);
  }
}
