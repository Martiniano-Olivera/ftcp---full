import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersPublicService } from '../../core/services/orders-public.service';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { Archivo } from '../../core/models/pedido.model';
import { PedidoService } from 'src/app/core/services/pedido.service';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent],
  templateUrl: './nuevo-pedido.component.html',
})
export class NuevoPedidoComponent {
  archivosUI: Archivo[] = [];
  files: File[] = [];
  model = { nombre: '', telefono: '' };
  enviado = false;
  loading = false;
  error: string | null = null;
  orderId?: string;

  constructor(
    private ordersService: OrdersPublicService,
    private pedidoService: PedidoService
  ) {}

  onFilesSelected(files: File[]): void {
    this.files = files;
  }

  onEliminar(id: string): void {
    this.archivosUI = this.archivosUI.filter((a) => a.id !== id);
  }

  prueba(e: File[]) {
    this.pedidoService.setFiles(e);
  }

  enviar(): void {
    if (
      this.loading ||
      !this.model.nombre ||
      !this.model.telefono ||
      this.files.length === 0
    ) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.ordersService
      .submitOrder({
        nombre: this.model.nombre,
        telefono: this.model.telefono,
        files: this.files,
      })
      .subscribe({
        next: (order) => {
          this.enviado = true;
          this.orderId = order.id;
          this.model = { nombre: '', telefono: '' };
          this.files = [];
          this.archivosUI = [];
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
