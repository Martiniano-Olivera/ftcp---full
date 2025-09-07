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
  archivos: Archivo[] = [];
  files: File[] = [];
  enviado = false;
  loading = false;
  error: string | null = null;
  orderId?: string;

  constructor(private ordersService: OrdersPublicService) {}

  onArchivoAgregado(archivo: Archivo): void {
    this.archivos = [...this.archivos, archivo];
  }

  onArchivoEliminado(id: string): void {
    this.archivos = this.archivos.filter((a) => a.id !== id);
  }

  onFilesSelected(files: File[]): void {
    this.files = files;
  }

  enviar(): void {
    if (!this.nombre || !this.telefono || this.files.length === 0 || this.loading) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.ordersService
      .submitOrder({ nombre: this.nombre, telefono: this.telefono, files: this.files })
      .subscribe({
        next: order => {
          this.enviado = true;
          this.orderId = order.id;
          this.nombre = '';
          this.telefono = '';
          this.archivos = [];
          this.files = [];
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
