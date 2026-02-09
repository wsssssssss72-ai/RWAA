
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Batch } from '../../core/models/batch.model';
import { computed } from '@angular/core';
import { WelcomeHeaderComponent } from '../../components/welcome-header/welcome-header.component';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, WelcomeHeaderComponent],
})
export class BatchesComponent implements OnInit {
  private state = inject(StateService);
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  profile = this.state.profile;
  isLoading = signal(true);
  
  private allBatches = signal<Batch[]>([]);
  private searchTerm = signal('');
  
  filteredBatches = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allBatches();
    return this.allBatches().filter(batch =>
      batch.course_name.toLowerCase().includes(term)
    );
  });

  isFavorite = (id: string) => this.state.isFavorite(id);

  ngOnInit(): void {
    this.fetchBatches();
    this.route.queryParams.subscribe(params => {
        this.searchTerm.set(params['q'] || '');
    });
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
    const message = this.isFavorite(batchId) ? 'Added to favorites' : 'Removed from saved';
    this.toastService.show(message, 'success');
  }

  handleImageError(event: Event, batchId: string): void {
    (event.target as HTMLImageElement).src = `https://picsum.photos/seed/${batchId}/400/225`;
  }
}
