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
    const files = Array.from(target.files || []);
    this.archivos = [];
    this.fileErrors = [];
    files.forEach(f => {
      if (f.type !== 'application/pdf') {
        this.fileErrors.push(`${f.name} no es un PDF válido`);
      } else if (f.size > 15 * 1024 * 1024) {
        this.fileErrors.push(`${f.name} supera 15MB`);
      } else {
        this.archivos.push(f);
      }
    });
  }

  enviar(): void {
    if (!this.nombre || !this.telefono || this.archivos.length === 0) {
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.ordersService
      .submitOrder({ nombre: this.nombre, telefono: this.telefono, files: this.archivos })
      .subscribe({
        next: order => {
          this.enviado = true;
          this.pedidoId = order.id;
          this.nombre = '';
          this.telefono = '';
          this.archivos = [];
        },
        error: () => {
          this.errorMsg = 'Intenta más tarde';
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
