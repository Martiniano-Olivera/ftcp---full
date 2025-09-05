import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';
import { Pedido } from '../../core/models/pedido.model';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'],
})
export class PagoComponent implements OnInit {
  pedido: Pedido | null = null;

  constructor(private pedidoService: PedidoService, private router: Router) {}

  ngOnInit(): void {
    this.pedidoService.pedido$.subscribe((pedido) => {
      this.pedido = pedido;
    });
  }

  procesarPago(): void {
    // Simulación de procesamiento de pago
    setTimeout(() => {
      this.router.navigate(['/pago/exito']);
    }, 2000);
  }

  volverInicio(): void {
    this.router.navigate(['/']);
  }
}
