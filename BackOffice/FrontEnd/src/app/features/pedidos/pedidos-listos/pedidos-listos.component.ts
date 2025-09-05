import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PedidosService } from '../../../core/services/pedidos.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Pedido, EstadoPedido } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-pedidos-listos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './pedidos-listos.component.html',
  styleUrls: ['./pedidos-listos.component.scss'],
})
export class PedidosListosComponent implements OnInit {
  pedidos: Pedido[] = [];
  filteredPedidos: Pedido[] = [];
  isLoading = false;

  // Computed properties for statistics
  get pedidosListos(): number {
    return this.pedidos?.filter(p => p.estado === 'listo')?.length || 0;
  }

  get pedidosCompletados(): number {
    return this.pedidos?.filter(p => p.estado === 'completado')?.length || 0;
  }

  // Filtros
  searchControl = new FormControl('');
  estadoFilter = new FormControl<EstadoPedido | 'todos'>('todos');
  fechaInicioFilter = new FormControl<Date | null>(null);
  fechaFinFilter = new FormControl<Date | null>(null);

  // Tabla
  displayedColumns: string[] = [
    'id',
    'clienteNombre',
    'archivos',
    'fechaCreacion',
    'fechaCompletado',
    'estado',
    'comprobante',
  ];

  constructor(
    private pedidosService: PedidosService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
    this.setupFilters();
  }

  loadPedidos(): void {
    this.isLoading = true;
    this.pedidosService.getPedidosCompletados().subscribe({
      next: (pedidos: Pedido[]) => {
        this.pedidos = pedidos;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notificationService.showError('Error al cargar pedidos: ' + error.message);
        this.isLoading = false;
      },
    });
  }

  setupFilters(): void {
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.estadoFilter.valueChanges.subscribe(() => this.applyFilters());
    this.fechaInicioFilter.valueChanges.subscribe(() => this.applyFilters());
    this.fechaFinFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    let filtered = [...this.pedidos];

    // Filtro de búsqueda
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(
        pedido =>
          pedido.clienteNombre.toLowerCase().includes(searchTerm) ||
          pedido.id.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro de estado
    if (this.estadoFilter.value && this.estadoFilter.value !== 'todos') {
      filtered = filtered.filter(pedido => pedido.estado === this.estadoFilter.value);
    }

    // Filtro de rango de fechas
    if (this.fechaInicioFilter.value || this.fechaFinFilter.value) {
      filtered = filtered.filter(pedido => {
        const pedidoDate = new Date(pedido.fechaCreacion);
        const inicio = this.fechaInicioFilter.value;
        const fin = this.fechaFinFilter.value;

        if (inicio && fin) {
          return pedidoDate >= inicio && pedidoDate <= fin;
        } else if (inicio) {
          return pedidoDate >= inicio;
        } else if (fin) {
          return pedidoDate <= fin;
        }
        return true;
      });
    }

    this.filteredPedidos = filtered;
  }

  abrirArchivo(url: string): void {
    window.open(url, '_blank');
  }

  getFileIcon(tipo: string): string {
    if (tipo.includes('pdf')) return 'picture_as_pdf';
    if (tipo.includes('image')) return 'image';
    if (tipo.includes('word')) return 'description';
    if (tipo.includes('powerpoint')) return 'slideshow';
    if (tipo.includes('excel')) return 'table_chart';
    return 'insert_drive_file';
  }

  getFileSize(size: number): string {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getEstadoColor(estado: EstadoPedido): string {
    switch (estado) {
      case 'pendiente':
        return 'warn';
      case 'procesando':
        return 'primary';
      case 'listo':
        return 'accent';
      case 'completado':
        return 'primary';
      default:
        return 'primary';
    }
  }

  limpiarFiltros(): void {
    this.searchControl.setValue('');
    this.estadoFilter.setValue('todos');
    this.fechaInicioFilter.setValue(null);
    this.fechaFinFilter.setValue(null);
  }

  exportarHistorial(): void {
    // Implementar exportación a CSV/Excel
    this.notificationService.showInfo('Función de exportación en desarrollo');
  }
}
