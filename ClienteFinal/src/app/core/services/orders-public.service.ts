import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PublicOrder {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  archivos: { nombre: string; url: string }[];
  estado: string;
  paid: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersPublicService {
  constructor(private http: HttpClient) {}

  submitOrder(form: {
    nombre: string;
    telefono: string;
    files: File[];
  }): Observable<PublicOrder> {
    const fd = new FormData();
    fd.append('clienteNombre', form.nombre);
    fd.append('clienteTelefono', form.telefono);
    form.files.forEach((f) => fd.append('files', f, f.name));
    return this.http.post<PublicOrder>(
      `${environment.apiUrl}/public/orders`,
      fd,
    );
  }
}
