import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-pedido.component.html'
})
export class NuevoPedidoComponent {
  nombre = '';
  telefono = '';
  archivos: File[] = [];
  enviado = false;
  loading = false;

  constructor(private http: HttpClient) {}

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.archivos = Array.from(target.files || []);
  }

  async enviar(): Promise<void> {
    if (!this.nombre || !this.telefono || this.archivos.length === 0) {
      return;
    }
    this.loading = true;
    try {
      const formData = new FormData();
      this.archivos.forEach((f) => formData.append('file', f));
      const uploaded = await this.http.post<{ nombre: string; path: string; url: string }[]>(
        `${environment.apiUrl}/orders/upload`,
        formData
      ).toPromise();
      const archivos = uploaded?.map((f) => ({ nombre: f.nombre, url: f.url })) || [];
      await this.http.post(`${environment.apiUrl}/orders`, {
        clienteNombre: this.nombre,
        clienteTelefono: this.telefono,
        archivos,
        paid: true,
      }).toPromise();
      this.enviado = true;
      this.nombre = '';
      this.telefono = '';
      this.archivos = [];
    } finally {
      this.loading = false;
    }
  }
}
