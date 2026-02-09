
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ToastComponent {
  toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  toastBorderColor(toast: Toast) {
    return computed(() => {
      switch (toast.type) {
        case 'success': return 'border-l-4 border-green-400';
        case 'error': return 'border-l-4 border-red-400';
        default: return 'border-l-4 border-purple-400';
      }
    });
  }
}
