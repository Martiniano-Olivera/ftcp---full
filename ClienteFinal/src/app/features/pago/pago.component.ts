import { PedidoService } from 'src/app/core/services/pedido.service';
import { OrdersPublicService } from '../../core/services/orders-public.service'; // ajustá la ruta
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Pedido } from 'src/app/core/models/pedido.model';

export class PagoComponent implements OnInit {
  pedido: Pedido | null = null;
  cargando = false;
  errorMsg = '';

  constructor(
    private pedidoService: PedidoService,
    private ordersPublic: OrdersPublicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pedidoService.pedido$.subscribe((p) => (this.pedido = p));
  }

  private debugPing(): void {
    // sanity check: forzar una request visible en Network al click
    fetch('http://localhost:3000/health', { method: 'GET' })
      .then((r) => r.text())
      .then((t) => console.log('[debugPing] ok', t))
      .catch((e) => console.error('[debugPing] error', e));
  }

  procesarPago(): void {
    console.log('[pago] click Pagar Ahora');
    this.debugPing(); // ← esto DEBERÍA verse en Network sí o sí

    // if (!this.pedido) {
    //   this.errorMsg = 'No hay pedido cargado.';
    //   return;
    // }

    // const files = this.pedidoService.getFiles();
    // if (!files?.length) {
    //   this.errorMsg = 'Faltan archivos PDF.';
    //   return;
    // }

    // // Tomá nombre y teléfono del modelo actual (ajustá keys si difieren)
    // const nombre =
    //   (this.pedido as any).clienteNombre ?? (this.pedido as any).nombre ?? '';
    // const telefono =
    //   (this.pedido as any).clienteTelefono ??
    //   (this.pedido as any).telefono ??
    //   '';

    // if (!nombre || !telefono) {
    //   this.errorMsg = 'Faltan datos del cliente.';
    //   return;
    // }

    // this.cargando = true;
    // this.ordersPublic
    //   .submitOrder({
    //     nombre,
    //     telefono,
    //     files,
    //   })
    //   .subscribe({
    //     next: (orderCreado) => {
    //       // opcional: guardar el id retornado
    //       // this.pedidoService.setBackendOrder(orderCreado);
    //       this.cargando = false;
    //       this.router.navigate(['/pago/exito']);
    //     },
    //     error: (err) => {
    //       console.error(err);
    //       this.cargando = false;
    //       this.errorMsg = 'No se pudo procesar el pago/crear el pedido.';
    //     },
    //   });
  }
}
