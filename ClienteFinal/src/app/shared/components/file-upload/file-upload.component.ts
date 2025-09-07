import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Archivo } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @Input() archivos: Archivo[] = [];
  @Output() archivoAgregado = new EventEmitter<Archivo>();
  @Output() archivoEliminado = new EventEmitter<string>();
  @Output() filesSelected = new EventEmitter<File[]>();

  isDragOver = false;
  private files: { id: string; file: File }[] = [];

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.procesarArchivos(files);
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.procesarArchivos(files);
    }
  }

  private procesarArchivos(files: FileList): void {
    Array.from(files).forEach((file) => {
      const id = this.generarId();
      const archivo: Archivo = {
        id,
        nombre: file.name,
        tamano: file.size,
        tipo: file.type || this.obtenerExtension(file.name),
        fechaSubida: new Date(),
      };
      this.files.push({ id, file });
      this.archivoAgregado.emit(archivo);
    });
    this.emitFiles();
  }

  private generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private obtenerExtension(nombre: string): string {
    return nombre.split('.').pop()?.toLowerCase() || 'unknown';
  }

  eliminarArchivo(archivoId: string): void {
    this.files = this.files.filter((f) => f.id !== archivoId);
    this.archivoEliminado.emit(archivoId);
    this.emitFiles();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private emitFiles(): void {
    this.filesSelected.emit(this.files.map((f) => f.file));
  }
}
