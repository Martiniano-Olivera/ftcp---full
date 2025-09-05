import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-exito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-exito.component.html',
  styleUrls: ['./pago-exito.component.scss'],
})
export class PagoExitoComponent {
  fechaActual = new Date();

  constructor(private router: Router) {}

  volverInicio(): void {
    this.router.navigate(['/']);
  }
}
