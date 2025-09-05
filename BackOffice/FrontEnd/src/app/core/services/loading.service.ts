import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _isLoading = signal(false);
  private readonly _loadingMessage = signal('Cargando...');

  public readonly isLoading = computed(() => this._isLoading());
  public readonly loadingMessage = computed(() => this._loadingMessage());

  show(message: string = 'Cargando...'): void {
    this._loadingMessage.set(message);
    this._isLoading.set(true);
  }

  hide(): void {
    this._isLoading.set(false);
  }

  setMessage(message: string): void {
    this._loadingMessage.set(message);
  }

  // Method to get the current loading state
  getLoadingState(): boolean {
    return this._isLoading();
  }
}
