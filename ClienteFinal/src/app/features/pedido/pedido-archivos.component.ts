import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../core/services/pedido.service';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { Archivo } from '../../core/models/pedido.model';

@Component({
  selector: 'app-pedido-archivos',
  standalone: true,
  imports: [CommonModule, FileUploadComponent],
  templateUrl: './pedido-archivos.component.html',
  styleUrls: ['./pedido-archivos.component.scss'],
})
export class PedidoArchivosComponent {
  archivos: Archivo[] = [];

  constructor(public pedidoService: PedidoService) {}

  onArchivoAgregado(a: Archivo) {
    this.archivos.push(a);
  }

  onArchivoEliminado(a: { id: string; nombre: string }) {
    this.archivos = this.archivos.filter(x => x.id !== a.id);
    this.pedidoService.setFiles?.(
      (this.pedidoService.getFiles?.() ?? []).filter(f => f.name !== a.nombre)
    );
  }

  onFilesSelected(files: File[]) {
    this.pedidoService.setFiles?.(files);
  }

  siguiente() {
    // navegar al siguiente paso si corresponde
  }
}

