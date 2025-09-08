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
  @Output() archivoEliminado = new EventEmitter<{ id: string; nombre: string }>();
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
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.procesarArchivos(files);
      // target.value = '';
    }
  }

  private procesarArchivos(files: FileList): void {
    const nuevos = Array.from(files);
    this._files.push(...nuevos);

    nuevos.forEach(file => {
      const archivo: Archivo = {
        id: this.generarId(),
        nombre: file.name,
        tamano: file.size,
        tipo: file.type || this.obtenerExtension(file.name),
        fechaSubida: new Date(),
      };
      this.archivoAgregado.emit(archivo);
    });

    this.filesSelected.emit([...this._files]);
  }

  private generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private obtenerExtension(nombre: string): string {
    return nombre.split('.').pop()?.toLowerCase() || 'unknown';
  }

  eliminarArchivo(archivoId: string): void {
    const archivo = this.archivos.find(a => a.id === archivoId);
    if (archivo) {
      this._files = this._files.filter(f => f.name !== archivo.nombre);
      this.filesSelected.emit([...this._files]);
      this.archivoEliminado.emit({ id: archivoId, nombre: archivo.nombre });
    } else {
      this.archivoEliminado.emit({ id: archivoId, nombre: '' });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
