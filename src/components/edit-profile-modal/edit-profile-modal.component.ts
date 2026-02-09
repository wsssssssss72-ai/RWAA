
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class EditProfileModalComponent {
  state = inject(StateService);
  localStorage = inject(LocalStorageService);
  toast = inject(ToastService);
  
  isOpen = this.state.editProfileModalOpen;
  
  name = signal('');
  bio = signal('');

  constructor() {
    const profile = this.state.profile();
    if (profile) {
      this.name.set(profile.name);
      this.bio.set(profile.bio);
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  saveProfile(): void {
    const newProfile = { name: this.name(), bio: this.bio() };
    this.state.setProfile(newProfile);
    this.localStorage.saveProfile(newProfile);
    this.toast.show('Profile updated', 'success');
    this.close();
  }
}
