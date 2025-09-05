import { Routes } from '@angular/router';
import { PagoComponent } from './pago.component';
import { PagoExitoComponent } from './pago-exito.component';

export const pagoRoutes: Routes = [
  {
    path: '',
    component: PagoComponent,
  },
  {
    path: 'exito',
    component: PagoExitoComponent,
  },
];
