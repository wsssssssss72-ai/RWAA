
import { Injectable, signal } from '@angular/core';

export type ToastType = 'info' | 'success' | 'error';
export interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info'): void {
    const newToast: Toast = { message, type, id: Date.now() };
    this.toasts.update(currentToasts => [...currentToasts, newToast]);

    setTimeout(() => {
      this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== newToast.id));
    }, 3000);
  }

  remove(toastId: number): void {
    this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== toastId));
  }
}
