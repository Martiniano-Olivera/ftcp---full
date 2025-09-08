import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersPublicService {
  constructor(private http: HttpClient) {}

  submitOrder(input: { nombre: string; telefono: string; files: File[] }) {
    const fd = new FormData();
    fd.set('clienteNombre', input.nombre);
    fd.set('clienteTelefono', input.telefono);
    input.files.forEach(f => fd.append('files', f, f.name));
    return this.http.post(`${environment.apiUrl}/public/orders`, fd);
  }
}
