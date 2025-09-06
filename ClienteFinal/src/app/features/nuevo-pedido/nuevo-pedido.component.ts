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
  enviado = false;
  loading = false;
  error: string | null = null;
  orderId?: string;

  constructor(private ordersService: OrdersPublicService) {}

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selected = Array.from(target.files || []);
    this.archivos = [];
    this.error = null;
    selected.forEach(f => {
      if (f.type !== 'application/pdf') {
        this.error = 'Solo se permiten archivos PDF';
      } else if (f.size > 15 * 1024 * 1024) {
        this.error = 'Cada archivo debe pesar menos de 15MB';
      } else {
        this.archivos.push(f);
      }
    });
  }

  enviar(): void {
    if (!this.nombre || !this.telefono || this.archivos.length === 0 || this.loading) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.ordersService
      .submitOrder({ nombre: this.nombre, telefono: this.telefono, files: this.archivos })
      .subscribe({
        next: order => {
          this.enviado = true;
          this.orderId = order.id;
          this.nombre = '';
          this.telefono = '';
          this.archivos = [];
        },
        error: () => {
          this.error = 'Intenta más tarde';
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
