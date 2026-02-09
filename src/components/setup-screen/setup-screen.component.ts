
import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-setup-screen',
  templateUrl: './setup-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupScreenComponent {
  setupCompleted = output<string>();
  private toastService = inject(ToastService);
  name = signal('');

  finishSetup(): void {
    const trimmedName = this.name().trim();
    if (!trimmedName) {
      this.toastService.show("Please enter your name", "error");
      return;
    }
    this.toastService.show("Welcome to Quantum!", "success");
    this.setupCompleted.emit(trimmedName);
  }
}
