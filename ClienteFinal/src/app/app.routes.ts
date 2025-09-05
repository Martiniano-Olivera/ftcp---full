import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/landing/landing.routes').then((m) => m.landingRoutes),
  },
  {
    path: 'pedido',
    loadChildren: () =>
      import('./features/pedido/pedido.routes').then((m) => m.pedidoRoutes),
  },
  {
    path: 'nuevo-pedido',
    loadComponent: () =>
      import('./features/nuevo-pedido/nuevo-pedido.component').then(
        (m) => m.NuevoPedidoComponent,
      ),
  },
  {
    path: 'pago',
    loadChildren: () =>
      import('./features/pago/pago.routes').then((m) => m.pagoRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
