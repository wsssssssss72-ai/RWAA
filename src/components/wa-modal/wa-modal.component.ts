
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-wa-modal',
  templateUrl: './wa-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class WaModalComponent {
  state = inject(StateService);
  router = inject(Router);

  waModal = this.state.waModal;
  private readonly WA_LINK = "https://whatsapp.com/channel/0029VbAvDSX0QeahEg4kkE3U";

  join(): void {
    window.open(this.WA_LINK, "_blank");
    this.close();
  }

  close(): void {
    const batch = this.waModal().pendingBatch;
    this.state.waModal.set({ open: false, pendingBatch: null });
    if (batch) {
      this.router.navigate(['/batch', batch.id]);
    }
  }
}
