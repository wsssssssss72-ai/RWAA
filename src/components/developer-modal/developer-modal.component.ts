
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-developer-modal',
  templateUrl: './developer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DeveloperModalComponent {
  state = inject(StateService);
  isOpen = this.state.developerModalOpen;

  close(): void {
    this.isOpen.set(false);
  }
}
