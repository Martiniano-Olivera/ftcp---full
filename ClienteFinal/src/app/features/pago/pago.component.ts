import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'],
})
export class PagoComponent implements OnInit {
  pedido: any = null;

  constructor(public pedidoService: PedidoService, private router: Router) {}

  ngOnInit(): void {
    this.pedidoService.pedido$?.subscribe((p: any) => this.pedido = p);
  }

  procesarPago(): void {
    this.router.navigate(['/pago/exito']);
  }

  volverInicio(): void {
    this.router.navigate(['/']);
  }
}
