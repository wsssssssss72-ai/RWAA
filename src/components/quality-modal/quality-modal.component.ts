import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { ApiService } from '../../core/services/api.service';
import { CryptoService } from '../../core/services/crypto.service';
import { ToastService } from '../../core/services/toast.service';
import { VideoDetails } from '../../core/models/content.model';

@Component({
  selector: 'app-quality-modal',
  templateUrl: './quality-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class QualityModalComponent {
  state = inject(StateService);
  api = inject(ApiService);
  crypto = inject(CryptoService);
  toast = inject(ToastService);

  qualityModal = this.state.qualityModal;
  
  private readonly RENDER_PLAYER = "https://lennisterrwa.vercel.app/player?url=";

  close(): void {
    this.state.qualityModal.set({ open: false, videoId: null, videoTitle: '', batchId: null });
  }

  playVideo(quality: '720p' | '480p' | '360p' | '240p' | '0'): void {
    const modalState = this.qualityModal();
    const videoId = modalState.videoId;
    const videoTitle = modalState.videoTitle;
    const batchId = modalState.batchId;
    this.close();
    
    if (!videoId || !batchId) {
        this.toast.show('Video information is missing.', 'error');
        return;
    }
    
    this.toast.show('Preparing video...', 'info');
    const endpoint = `/get/fetchVideoDetailsById?course_id=${batchId}&video_id=${videoId}&ytflag=0&folder_wise_course=0`;

    this.api.apiCall<VideoDetails>(endpoint).subscribe(res => {
        // FIX: Add type guard to ensure res.data is not an empty array from an API error.
        if(res.data && !Array.isArray(res.data)) {
            const data = res.data;
            if(data.video_id && !data.download_link) {
                let vid = data.video_id; 
                if(vid.length > 20) vid = this.crypto.decrypt(vid);
                const youtubeUrl = `https://www.youtube.com/embed/${vid}?autoplay=1`;
                this.state.videoPlayer.set({ open: true, url: youtubeUrl, title: videoTitle });
            } else if(data.download_link) {
                let url = this.crypto.decrypt(data.download_link);
                if(quality !== '0') {
                    url = url.replace(/\/(\d{3,4}p)\//, `/${quality}/`);
                }
                const playerUrl = `${this.RENDER_PLAYER}${encodeURIComponent(url)}`;
                this.state.videoPlayer.set({ open: true, url: playerUrl, title: videoTitle });
            } else {
                this.toast.show("Video not available", "error");
            }
        } else { 
            this.toast.show("Video not found", "error"); 
        }
    });
  }
}
