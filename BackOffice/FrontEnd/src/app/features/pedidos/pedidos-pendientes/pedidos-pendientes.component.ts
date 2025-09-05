import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule, MatChipOption } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PedidosService } from '../../../core/services/pedidos.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Pedido, EstadoPedido } from '../../../core/models/pedido.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pedidos-pendientes',
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
    MatChipOption,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './pedidos-pendientes.component.html',
  styleUrls: ['./pedidos-pendientes.component.scss'],
})
export class PedidosPendientesComponent implements OnInit, OnDestroy {
  pedidos: Pedido[] = [];
  filteredPedidos: Pedido[] = [];
  isLoading = false;

  get pedidosPendientes(): number {
    return this.pedidos?.filter(p => p.estado === 'pendiente')?.length || 0;
  }

  get pedidosProcesando(): number {
    return this.pedidos?.filter(p => p.estado === 'procesando')?.length || 0;
  }

  searchControl = new FormControl('');
  estadoFilter = new FormControl<EstadoPedido | 'todos'>('todos');
  fechaFilter = new FormControl<Date | null>(null);

  displayedColumns: string[] = [
    'id',
    'clienteNombre',
    'archivos',
    'fechaCreacion',
    'estado',
    'acciones',
  ];

  private refreshInterval: any;
  private readonly refreshTime = environment.autoRefreshInterval;

  constructor(
    private pedidosService: PedidosService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
    this.setupAutoRefresh();
    this.setupFilters();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadPedidos(): void {
    this.isLoading = true;
    this.pedidosService.getPedidosPendientes().subscribe({
      next: pedidos => {
        this.pedidos = pedidos;
        this.applyFilters();
        this.isLoading = false;
      },
      error: error => {
        this.notificationService.showError('Error al cargar pedidos: ' + error.message);
        this.isLoading = false;
      },
    });
  }

  setupAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      this.pedidosService.refreshPedidos().subscribe({
        next: pedidos => {
          this.pedidos = pedidos;
          this.applyFilters();
        },
        error: error => {
          console.warn('Error en auto-refresh:', error);
        },
      });
    }, this.refreshTime);
  }

  setupFilters(): void {
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.estadoFilter.valueChanges.subscribe(() => this.applyFilters());
    this.fechaFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    let filtered = [...this.pedidos];

    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(
        pedido =>
          pedido.clienteNombre.toLowerCase().includes(searchTerm) ||
          pedido.id.toLowerCase().includes(searchTerm)
      );
    }

    if (this.estadoFilter.value && this.estadoFilter.value !== 'todos') {
      filtered = filtered.filter(pedido => pedido.estado === this.estadoFilter.value);
    }

    if (this.fechaFilter.value) {
      const filterDate = new Date(this.fechaFilter.value);
      filtered = filtered.filter(pedido => {
        const pedidoDate = new Date(pedido.fechaCreacion);
        return pedidoDate.toDateString() === filterDate.toDateString();
      });
    }

    this.filteredPedidos = filtered;
  }

  marcarComoListo(pedido: Pedido): void {
    const telefono = pedido.telefonoCliente || prompt('Teléfono del cliente');
    if (!telefono) {
      return;
    }
    this.pedidosService.marcarComoListo(pedido.id).subscribe({
      next: () => {
        this.pedidosService.getWhatsAppLink(pedido.id, telefono).subscribe({
          next: (response) => {
            window.open(response.link, '_blank');
            this.notificationService.showSuccess(`Pedido #${pedido.id} marcado como listo`);
            this.loadPedidos();
          },
          error: (error) => {
            this.notificationService.showError('Error al generar enlace de WhatsApp: ' + error.message);
          },
        });
      },
      error: (error) => {
        this.notificationService.showError('Error al marcar pedido como listo: ' + error.message);
      },
    });
  }

  abrirArchivo(url: string): void {
    window.open(url, '_blank');
  }

  getFileIcon(tipo: string = ''): string {
    if (tipo.includes('pdf')) return 'picture_as_pdf';
    if (tipo.includes('image')) return 'image';
    if (tipo.includes('word')) return 'description';
    if (tipo.includes('powerpoint')) return 'slideshow';
    if (tipo.includes('excel')) return 'table_chart';
    return 'insert_drive_file';
  }

  getFileSize(size: number = 0): string {
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
    this.fechaFilter.setValue(null);
  }
}
