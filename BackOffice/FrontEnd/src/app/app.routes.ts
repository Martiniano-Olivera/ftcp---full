import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'pedidos/pendientes',
        pathMatch: 'full'
      },
      {
        path: 'pedidos',
        children: [
          {
            path: 'pendientes',
            loadComponent: () => import('./features/pedidos/pedidos-pendientes/pedidos-pendientes.component').then(m => m.PedidosPendientesComponent)
          },
          {
            path: 'listos',
            loadComponent: () => import('./features/pedidos/pedidos-listos/pedidos-listos.component').then(m => m.PedidosListosComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'pedidos/pendientes'
  }
];
