import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersApiService } from '../../core/services/orders-api.service';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.scss'],
})
export class NuevoPedidoComponent {
  enviado = false;
  form = this.fb.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    archivos: [null as FileList | null, Validators.required],
  });

  constructor(private fb: FormBuilder, private ordersApi: OrdersApiService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.form.patchValue({ archivos: input.files });
  }

  async enviar() {
    if (this.form.invalid) return;
    const files = Array.from(this.form.value.archivos as FileList);
    const uploaded = await this.ordersApi.upload(files);
    await this.ordersApi.createOrder({
      clienteNombre: this.form.value.nombre!,
      clienteTelefono: this.form.value.telefono!,
      archivos: uploaded,
      paid: true,
    });
    this.enviado = true;
    this.form.reset();
  }
}
