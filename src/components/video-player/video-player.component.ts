
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class VideoPlayerComponent {
  state = inject(StateService);
  sanitizer = inject(DomSanitizer);

  videoPlayerState = this.state.videoPlayer;

  safeUrl = computed(() => {
      const url = this.videoPlayerState().url;
      return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  });

  close(): void {
    this.state.videoPlayer.set({ open: false, url: '', title: '' });
  }
}
