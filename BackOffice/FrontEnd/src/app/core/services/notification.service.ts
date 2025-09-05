import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000): void {
    this.showNotification(message, 'success', duration);
  }

  showError(message: string, duration: number = 5000): void {
    this.showNotification(message, 'error', duration);
  }

  showWarning(message: string, duration: number = 4000): void {
    this.showNotification(message, 'warning', duration);
  }

  showInfo(message: string, duration: number = 3000): void {
    this.showNotification(message, 'info', duration);
  }

  private showNotification(message: string, type: NotificationType, duration: number): void {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}
