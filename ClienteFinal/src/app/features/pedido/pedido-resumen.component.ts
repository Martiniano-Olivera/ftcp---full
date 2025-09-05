import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../core/models/pedido.model';
import { SummaryCardComponent } from '../../shared/components/summary-card/summary-card.component';

@Component({
  selector: 'app-pedido-resumen',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent],
  templateUrl: './pedido-resumen.component.html',
  styleUrls: ['./pedido-resumen.component.scss'],
})
export class PedidoResumenComponent {
  @Input() pedido: Pedido | null = null;
  @Output() anteriorClicked = new EventEmitter<void>();
  @Output() confirmarClicked = new EventEmitter<void>();

  anterior(): void {
    this.anteriorClicked.emit();
  }

  confirmar(): void {
    this.confirmarClicked.emit();
  }
}
