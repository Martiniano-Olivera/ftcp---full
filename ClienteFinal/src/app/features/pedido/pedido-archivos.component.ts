import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Archivo } from '../../core/models/pedido.model';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-pedido-archivos',
  standalone: true,
  imports: [CommonModule, FileUploadComponent],
  templateUrl: './pedido-archivos.component.html',
  styleUrls: ['./pedido-archivos.component.scss'],
})
export class PedidoArchivosComponent {
  @Input() archivos: Archivo[] = [];
  @Output() archivoAgregado = new EventEmitter<Archivo>();
  @Output() archivoEliminado = new EventEmitter<string>();
  @Output() siguienteClicked = new EventEmitter<void>();

  files: File[] = [];

  onArchivoAgregado(archivo: Archivo): void {
    this.archivoAgregado.emit(archivo);
  }

  onArchivoEliminado(archivoId: string): void {
    this.archivoEliminado.emit(archivoId);
  }

  onFilesSelected(files: File[]): void {
    this.files = files;
  }

  siguiente(): void {
    this.siguienteClicked.emit();
  }
}
