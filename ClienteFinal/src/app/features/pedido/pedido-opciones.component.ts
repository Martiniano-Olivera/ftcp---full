import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpcionesImpresion } from '../../core/models/pedido.model';

@Component({
  selector: 'app-pedido-opciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido-opciones.component.html',
  styleUrls: ['./pedido-opciones.component.scss'],
})
export class PedidoOpcionesComponent {
  @Input() opciones: OpcionesImpresion = {
    tipoImpresion: 'simple',
    cantidad: 1,
    color: false,
    tamanoPapel: 'A4',
    orientacion: 'vertical',
  };
  @Output() opcionesActualizadas = new EventEmitter<OpcionesImpresion>();
  @Output() anteriorClicked = new EventEmitter<void>();
  @Output() siguienteClicked = new EventEmitter<void>();

  guardarOpciones(): void {
    this.opcionesActualizadas.emit(this.opciones);
    this.siguienteClicked.emit();
  }

  anterior(): void {
    this.anteriorClicked.emit();
  }
}
