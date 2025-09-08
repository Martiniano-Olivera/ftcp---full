import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersPublicService } from '../../core/services/orders-public.service';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { PedidoService } from '../../core/services/pedido.service';
import { Archivo } from '../../core/models/pedido.model';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent],
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.scss'],
})
export class NuevoPedidoComponent {
  model = { nombre: '', telefono: '' };
  files: File[] = [];
  archivosUI: Archivo[] = [];
  loading = false;
  enviado = false;
  orderId?: string;

  constructor(
    public pedidoService: PedidoService,
    private ordersPublic: OrdersPublicService,
    private router: Router
  ) {}

  onFilesSelected(files: File[]) {
    this.files = files;
    this.pedidoService.setFiles?.(files);
  }

  onEliminar(archivo: { id: string; nombre: string }) {
    this.archivosUI = this.archivosUI.filter(a => a.id !== archivo.id);
    this.files = this.files.filter(f => f.name !== archivo.nombre);
    this.pedidoService.setFiles?.(this.files);
  }

  enviar() {
    if (!this.files.length || !this.model.nombre || !this.model.telefono) return;
    this.loading = true;
    this.ordersPublic.submitOrder({
      nombre: this.model.nombre,
      telefono: this.model.telefono,
      files: this.files
    }).subscribe({
      next: (order: any) => {
        this.orderId = order?.id;
        this.enviado = true;
        this.loading = false;
        // this.router.navigate(['/pago']);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
