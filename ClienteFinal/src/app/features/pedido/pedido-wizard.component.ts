import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';
import { Pedido } from '../../core/models/pedido.model';
import { PedidoArchivosComponent } from './pedido-archivos.component';
import { PedidoOpcionesComponent } from './pedido-opciones.component';
import { PedidoResumenComponent } from './pedido-resumen.component';

@Component({
  selector: 'app-pedido-wizard',
  standalone: true,
  imports: [
    CommonModule,
    PedidoArchivosComponent,
    PedidoOpcionesComponent,
    PedidoResumenComponent,
  ],
  templateUrl: './pedido-wizard.component.html',
  styleUrls: ['./pedido-wizard.component.scss'],
})
export class PedidoWizardComponent implements OnInit {
  pasoActual = 1;
  pedido: Pedido | null = null;

  constructor(private pedidoService: PedidoService, private router: Router) {}

  ngOnInit(): void {
    this.pedidoService.pedido$.subscribe((pedido) => {
      this.pedido = pedido;
    });
  }

  siguientePaso(): void {
    if (this.pasoActual < 3) {
      this.pasoActual++;
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  onOpcionesActualizadas(opciones: any): void {
    this.pedidoService.actualizarOpciones(opciones);
  }

  confirmarPedido(): void {
    this.pedidoService.confirmarPedido();
    this.router.navigate(['/pago']);
  }
}
