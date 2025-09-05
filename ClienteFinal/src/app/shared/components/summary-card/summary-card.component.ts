import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent {
  @Input() pedido!: Pedido;

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getTipoImpresionText(tipo: string): string {
    return tipo === 'simple' ? 'Simple cara' : 'Doble cara';
  }

  getOrientacionText(orientacion: string): string {
    return orientacion === 'vertical' ? 'Vertical' : 'Horizontal';
  }
}
