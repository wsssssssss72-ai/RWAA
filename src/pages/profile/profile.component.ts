
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ProfileComponent {
  private state = inject(StateService);
  private localStorage = inject(LocalStorageService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  profile = this.state.profile;
  avatarUrl = computed(() => {
    const name = this.profile()?.name;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'User')}&backgroundColor=0a0a0f`;
  });

  editProfile(): void {
    this.state.editProfileModalOpen.set(true);
  }

  showDeveloperInfo(): void {
    this.state.developerModalOpen.set(true);
  }

  clearData(): void {
    if (confirm("Reset all data? This will remove all saved preferences.")) {
      this.localStorage.clearAllData();
      this.toastService.show("System reset complete", "info");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
}
