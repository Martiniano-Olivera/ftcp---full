import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.scss'],
})
export class NuevoPedidoComponent {
  nombre = '';
  telefono = '';
  files: File[] = [];
  enviado = false;
  private apiUrl = (import.meta as any).env.NG_APP_API_URL || '';

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.files = input.files ? Array.from(input.files) : [];
  }

  async enviar() {
    const formData = new FormData();
    this.files.forEach((f) => formData.append('file', f));
    const uploadRes = await fetch(`${this.apiUrl}/orders/upload`, {
      method: 'POST',
      body: formData,
    });
    const uploaded = await uploadRes.json();
    const archivos = uploaded.map((u: any) => ({ nombre: u.nombre, url: u.url }));
    await fetch(`${this.apiUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clienteNombre: this.nombre,
        clienteTelefono: this.telefono,
        archivos,
        paid: true,
      }),
    });
    this.nombre = '';
    this.telefono = '';
    this.files = [];
    this.enviado = true;
  }
}
