import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersPublicService } from '../../core/services/orders-public.service';
import { Archivo } from '../../core/models/pedido.model';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent],
  templateUrl: './nuevo-pedido.component.html'
})
export class NuevoPedidoComponent {
  nombre = '';
  telefono = '';
  archivos: File[] = [];
  archivosMeta: Archivo[] = [];
  enviado = false;
  loading = false;
  error: string | null = null;
  orderId?: string;

  constructor(private ordersService: OrdersPublicService) {}

  onFilesSelected(files: File[]): void {
    this.archivos = files;
  }

  onArchivoAgregado(archivo: Archivo): void {
    this.archivosMeta = [...this.archivosMeta, archivo];
  }

  onArchivoEliminado(id: string): void {
    this.archivosMeta = this.archivosMeta.filter(a => a.id !== id);
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
          this.archivosMeta = [];
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
