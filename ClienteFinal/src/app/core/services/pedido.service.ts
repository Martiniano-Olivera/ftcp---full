import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Archivo, OpcionesImpresion, Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private pedidoSubject = new BehaviorSubject<Pedido | null>(null);
  public pedido$ = this.pedidoSubject.asObservable();

  constructor() {
    this.inicializarPedido();
  }

  private inicializarPedido(): void {
    const pedidoInicial: Pedido = {
      id: this.generarId(),
      archivos: [],
      opciones: {
        tipoImpresion: 'simple',
        cantidad: 1,
        color: false,
        tamanoPapel: 'A4',
        orientacion: 'vertical',
      },
      precioEstimado: 0,
      fechaCreacion: new Date(),
      estado: 'borrador',
    };
    this.pedidoSubject.next(pedidoInicial);
  }

  private generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  agregarArchivo(archivo: Archivo): void {
    const pedidoActual = this.pedidoSubject.value;
    if (pedidoActual) {
      const nuevoPedido = {
        ...pedidoActual,
        archivos: [...pedidoActual.archivos, archivo],
      };
      this.actualizarPrecio(nuevoPedido);
      this.pedidoSubject.next(nuevoPedido);
    }
  }

  eliminarArchivo(archivoId: string): void {
    const pedidoActual = this.pedidoSubject.value;
    if (pedidoActual) {
      const nuevoPedido = {
        ...pedidoActual,
        archivos: pedidoActual.archivos.filter((a) => a.id !== archivoId),
      };
      this.actualizarPrecio(nuevoPedido);
      this.pedidoSubject.next(nuevoPedido);
    }
  }

  actualizarOpciones(opciones: Partial<OpcionesImpresion>): void {
    const pedidoActual = this.pedidoSubject.value;
    if (pedidoActual) {
      const nuevoPedido = {
        ...pedidoActual,
        opciones: { ...pedidoActual.opciones, ...opciones },
      };
      this.actualizarPrecio(nuevoPedido);
      this.pedidoSubject.next(nuevoPedido);
    }
  }

  private actualizarPrecio(pedido: Pedido): void {
    const precioBase = 0.5;
    const precioColor = pedido.opciones.color ? 1.0 : 0;
    const precioDoble = pedido.opciones.tipoImpresion === 'doble' ? 0.25 : 0;
    const precioTamano = pedido.opciones.tamanoPapel === 'A3' ? 0.75 : 0;

    pedido.precioEstimado =
      (precioBase + precioColor + precioDoble + precioTamano) *
      pedido.opciones.cantidad *
      pedido.archivos.length;
  }

  confirmarPedido(): void {
    const pedidoActual = this.pedidoSubject.value;
    if (pedidoActual && pedidoActual.archivos.length > 0) {
      const nuevoPedido: Pedido = {
        ...pedidoActual,
        estado: 'confirmado' as const,
      };
      this.pedidoSubject.next(nuevoPedido);
    }
  }

  obtenerPedido(): Pedido | null {
    return this.pedidoSubject.value;
  }

  limpiarPedido(): void {
    this.inicializarPedido();
  }
}
