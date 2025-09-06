import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersPublicService } from '../../core/services/orders-public.service';

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
  fileErrors: string[] = [];
  enviado = false;
  loading = false;
  pedidoId?: string;
  errorMsg = '';

  constructor(private ordersService: OrdersPublicService) {}

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selected = Array.from(target.files || []);
    this.fileErrors = [];
    this.archivos = [];
    selected.forEach((f) => {
      if (f.type !== 'application/pdf') {
        this.fileErrors.push(`${f.name} no es un PDF válido`);
      } else if (f.size > 15 * 1024 * 1024) {
        this.fileErrors.push(`${f.name} supera los 15MB`);
      } else {
        this.archivos.push(f);
      }
    });
  }

  async enviar(): Promise<void> {
    if (!this.nombre || !this.telefono || this.archivos.length === 0) {
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    try {
      const pedido = await this.ordersService
        .submitOrder({
          nombre: this.nombre,
          telefono: this.telefono,
          files: this.archivos,
        })
        .toPromise();
      this.enviado = true;
      this.pedidoId = pedido?.id;
      this.nombre = '';
      this.telefono = '';
      this.archivos = [];
    } catch {
      this.errorMsg = 'Intenta más tarde';
    } finally {
      this.loading = false;
    }
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  reset(): void {
    this.enviado = false;
    this.pedidoId = undefined;
  }
}
