
import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Batch } from '../../core/models/batch.model';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PageHeaderComponent],
})
export class FavoritesComponent implements OnInit {
  private state = inject(StateService);
  private api = inject(ApiService);
  private toastService = inject(ToastService);

  isLoading = signal(true);
  private allBatches = signal<Batch[]>([]);

  favoriteBatches = computed(() => {
    const favIds = new Set(this.state.favorites());
    return this.allBatches().filter(batch => favIds.has(batch.id));
  });

  isFavorite = (id: string) => this.state.isFavorite(id);

  ngOnInit(): void {
    this.fetchBatches();
  }

  fetchBatches(): void {
    this.isLoading.set(true);
    this.api.apiCall<Batch[]>('/get/mycoursev2?').subscribe(res => {
      if (res.data) {
        this.allBatches.set(res.data);
      }
      this.isLoading.set(false);
    });
  }

  onBatchClick(batch: Batch): void {
    this.state.waModal.set({ open: true, pendingBatch: batch });
  }

  toggleFavorite(event: MouseEvent, batchId: string): void {
    event.stopPropagation();
    this.state.toggleFavorite(batchId);
    const message = this.state.isFavorite(batchId) ? 'Added to favorites' : 'Removed from saved';
    this.toastService.show(message, 'success');
  }

  handleImageError(event: Event, batchId: string): void {
    (event.target as HTMLImageElement).src = `https://picsum.photos/seed/${batchId}/400/225`;
  }
}
