import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async upload(files: File[]): Promise<{ nombre: string; url: string }[]> {
    const formData = new FormData();
    files.forEach((f) => formData.append('file', f, f.name));
    const resp = await firstValueFrom(
      this.http.post<{ nombre: string; path: string; url: string }[]>(
        `${this.apiUrl}/orders/upload`,
        formData,
      ),
    );
    return resp.map((f) => ({ nombre: f.nombre, url: f.url }));
  }

  createOrder(data: {
    clienteNombre: string;
    clienteTelefono: string;
    archivos: { nombre: string; url: string }[];
    paid: boolean;
  }): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/orders`, data));
  }
}
