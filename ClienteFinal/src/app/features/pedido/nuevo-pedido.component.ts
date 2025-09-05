import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-pedido.component.html',
})
export class NuevoPedidoComponent {
  nombre = '';
  telefono = '';
  archivos: File[] = [];
  mensaje = '';

  constructor(private http: HttpClient) {}

  onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.archivos = Array.from(input.files);
    }
  }

  async submit() {
    const formData = new FormData();
    this.archivos.forEach((f) => formData.append('file', f));
    const uploaded: any[] = await this.http
      .post<any[]>(`${environment.apiBaseUrl}/orders/upload`, formData)
      .toPromise();
    await this.http
      .post(`${environment.apiBaseUrl}/orders`, {
        clienteNombre: this.nombre,
        clienteTelefono: this.telefono,
        archivos: uploaded.map((u) => ({ nombre: u.nombre, url: u.url })),
        paid: true,
      })
      .toPromise();
    this.mensaje = 'Pedido enviado';
    this.nombre = '';
    this.telefono = '';
    this.archivos = [];
  }
}
