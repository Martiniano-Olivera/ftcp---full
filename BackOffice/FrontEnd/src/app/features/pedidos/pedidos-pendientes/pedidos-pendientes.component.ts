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
import { MatChipListboxChange, MatChipOption } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PedidosService } from '../../../core/services/pedidos.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Pedido } from '../../../core/models/pedido.model';
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

  // Computed properties for statistics
  get pedidosPendientes(): number {
    return this.pedidos?.filter(p => p.estado === 'pendiente')?.length || 0;
  }

  get pedidosProcesando(): number {
    return this.pedidos?.filter(p => p.estado === 'procesando')?.length || 0;
  }

  // Filtros
  searchControl = new FormControl('');
  estadoFilter = new FormControl<EstadoPedido | 'todos'>('todos');
  fechaFilter = new FormControl<Date | null>(null);

  // Tabla
  displayedColumns: string[] = [
    'id',
    'clienteNombre',
    'archivos',
    'fechaCreacion',
    'estado',
    'acciones',
  ];

  // Auto-refresh
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
        this.pedidos = pedidos.map(o => ({
          ...o,
          fechaCreacion: (o as any).fechaCreacion ?? (o as any).createdAt ?? (o as any)['createdAt'],
          archivos: (o.archivos ?? []).map((a: any) => ({
            nombre: a.nombre ?? a.fileName ?? 'archivo.pdf',
            url: a.url,
            tipo: a.tipo ?? 'pdf',
            tamano: a.tamano ?? null,
          })),
        }));
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
          this.pedidos = pedidos.map(o => ({
            ...o,
            fechaCreacion: (o as any).fechaCreacion ?? (o as any).createdAt ?? (o as any)['createdAt'],
            archivos: (o.archivos ?? []).map((a: any) => ({
              nombre: a.nombre ?? a.fileName ?? 'archivo.pdf',
              url: a.url,
              tipo: a.tipo ?? 'pdf',
              tamano: a.tamano ?? null,
            })),
          }));
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

    // Filtro de fecha
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
    this.pedidosService.marcarComoListo(pedido.id).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Pedido #${pedido.id} marcado como listo`);
        this.loadPedidos(); // Recargar lista
      },
      error: error => {
        this.notificationService.showError('Error al marcar pedido como listo: ' + error.message);
      },
    });
  }

  abrirWhatsApp(pedido: Pedido): void {
    let phone = pedido.clienteTelefono;
    if (!phone) {
      phone = prompt('Ingrese teléfono del cliente') || '';
      if (!phone) {
        return;
      }
    }
    this.pedidosService.getWhatsAppLink(pedido.id, phone).subscribe({
      next: response => {
        window.open(response.link, '_blank');
      },
      error: error => {
        this.notificationService.showError('Error al generar enlace de WhatsApp: ' + error.message);
      },
    });
  }

  abrirArchivo(url: string): void {
    if (url) window.open(url, '_blank', 'noopener');
  }

  getFileIcon(tipo?: string): string {
    return 'picture_as_pdf';
  }

  getFileSize(t?: number): string {
    return t ? `${(t / 1024 / 1024).toFixed(2)} MB` : '';
  }

  getEstadoColor(estado: string): string {
    const e = (estado || '').toLowerCase();
    if (e === 'pendiente') return 'warn';
    if (e === 'procesando') return 'accent';
    if (e === 'listo') return 'primary';
    return 'basic';
  }

  limpiarFiltros(): void {
    this.searchControl.setValue('');
    this.estadoFilter.setValue('todos');
    this.fechaFilter.setValue(null);
  }
}
