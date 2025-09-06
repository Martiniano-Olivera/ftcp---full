import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isLoading = false;
  appName = environment.appName;
  appVersion = environment.version;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Usar el signal directamente
    this.isLoading = this.loadingService.getLoadingState();

    // Si necesitamos reactividad, podemos usar un effect o computed
    // Por ahora, usamos el método directo
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCurrentRoute(): string {
    const url = this.router.url;
    if (url.includes('pendientes')) return 'Pedidos Pendientes';
    if (url.includes('listos')) return 'Pedidos Completados';
    return 'Dashboard';
  }
}
