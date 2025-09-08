import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersPublicService } from '../../core/services/orders-public.service';
// Ajusta el import del file-upload si es standalone:
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
  // Modelo de formulario
  model = { nombre: '', telefono: '' };

  // Blobs reales para FormData
  files: File[] = [];

  // UI
  archivosUI: Archivo[] = [];
  loading = false;
  enviado = false;
  orderId?: string;

  constructor(
    public pedidoService: PedidoService, // público si se usa desde template
    private ordersPublic: OrdersPublicService,
    private router: Router
  ) {}

  // Recibe blobs del <app-file-upload>
  onFilesSelected(files: File[]) {
    this.files = files;
    // opcional: persistir en servicio si el wizard lo necesita
    this.pedidoService.setFiles?.(files);
  }

  onEliminar(archivo: { id: string; nombre: string }) {
    // sincroniza UI
    this.archivosUI = this.archivosUI.filter(a => a.id !== archivo.id);
    // sincroniza blobs
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
        // Navegar al paso de pago si corresponde:
        // this.router.navigate(['/pago']);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        // TODO: mostrar toast
      }
    });
  }
}

