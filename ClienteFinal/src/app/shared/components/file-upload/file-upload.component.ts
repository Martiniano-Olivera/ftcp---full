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

  private _files: File[] = [];
  isDragOver = false;

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
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.procesarArchivos(input.files);
    // input.value = '';
  }

  private procesarArchivos(files: FileList): void {
    const nuevos = Array.from(files);

    // 1) Guardar los File para FormData
    const validos: File[] = [];
    nuevos.forEach(f => {
      if (f.type === 'application/pdf' && f.size <= 15 * 1024 * 1024) {
        validos.push(f);
      }
    });
    this._files.push(...validos);

    // 2) Emitir metadatos (lo que ya hacías)
    validos.forEach((file) => {
      const archivo: Archivo = {
        id: this.generarId(),
        nombre: file.name,
        tamano: file.size,
        tipo: file.type || this.obtenerExtension(file.name),
        fechaSubida: new Date(),
      };
      this.archivoAgregado.emit(archivo);
    });

    // 3) Emitir también los File reales
    this.filesSelected.emit([...this._files]);
  }

  private generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private obtenerExtension(nombre: string): string {
    return nombre.split('.').pop()?.toLowerCase() || 'unknown';
  }

  eliminarArchivoPorNombre(nombre: string): void {
    this._files = this._files.filter(f => f.name !== nombre);
    this.filesSelected.emit([...this._files]);
    this.archivoEliminado.emit(nombre);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
