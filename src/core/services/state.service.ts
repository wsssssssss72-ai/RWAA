
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Profile } from '../models/profile.model';
import { LocalStorageService } from './local-storage.service';
import { Batch } from '../models/batch.model';

@Injectable({ providedIn: 'root' })
export class StateService {
  private localStorage = inject(LocalStorageService);
  
  // Profile State
  profile = signal<Profile | null>(null);

  // Favorites State
  private favoriteIds = signal<string[]>(this.localStorage.getFavorites());
  favorites = computed(() => this.favoriteIds());
  
  // UI State
  developerModalOpen = signal(false);
  editProfileModalOpen = signal(false);
  waModal = signal<{ open: boolean; pendingBatch: Batch | null }>({ open: false, pendingBatch: null });
  qualityModal = signal<{ open: boolean; videoId: string | null, videoTitle: string, batchId: string | null }>({ open: false, videoId: null, videoTitle: '', batchId: null });
  videoPlayer = signal<{ open: boolean; url: string; title: string }>({ open: false, url: '', title: '' });


  constructor() {
    // Effect to auto-save favorites to localStorage
    effect(() => {
      this.localStorage.saveFavorites(this.favoriteIds());
    });
  }

  setProfile(profile: Profile | null): void {
    this.profile.set(profile);
  }

  toggleFavorite(batchId: string): void {
    this.favoriteIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(batchId)) {
        newIds.delete(batchId);
      } else {
        newIds.add(batchId);
      }
      return Array.from(newIds);
    });
  }

  isFavorite(batchId: string): boolean {
    return this.favoriteIds().includes(batchId);
  }
}
