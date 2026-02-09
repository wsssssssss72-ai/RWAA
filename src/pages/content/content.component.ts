
import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { StateService } from '../../core/services/state.service';
import { ToastService } from '../../core/services/toast.service';
import { CryptoService } from '../../core/services/crypto.service';
import { Content, VideoDetails } from '../../core/models/content.model';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PageHeaderComponent],
})
export class ContentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private state = inject(StateService);
  private crypto = inject(CryptoService);
  private toast = inject(ToastService);

  private allContent = signal<Content[]>([]);
  isLoading = signal(true);
  
  batchId = signal('');
  subjectId = signal('');
  topicName = signal('');

  filter = signal<'video' | 'pdf'>('video');

  filteredContent = computed(() => {
    const currentFilter = this.filter();
    return this.allContent().filter(item => {
      if (currentFilter === 'video') return item.id;
      return item.pdf_link || item.pdf_link2;
    });
  });

  private readonly RENDER_PDF = "https://lennisterrwa.vercel.app/pdf-viewer?url=";
  private readonly RENDER_PLAYER = "https://lennisterrwa.vercel.app/player?url=";

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bId = params.get('batchId');
      const sId = params.get('subjectId');
      const tId = params.get('topicId');
      if (bId && sId && tId) {
        this.batchId.set(bId);
        this.subjectId.set(sId);
        this.topicName.set(`Topic ${tId.slice(0, 6)}...`);
        this.fetchContent(bId, sId, tId);
      }
    });
  }

  fetchContent(bId: string, sId: string, tId: string): void {
    this.isLoading.set(true);
    const endpoint = `/get/livecourseclassbycoursesubtopconceptapiv3?courseid=${bId}&subjectid=${sId}&topicid=${tId}&conceptid=&start=-1`;
    this.api.apiCall<Content[]>(endpoint).subscribe(res => {
      this.allContent.set(res.data || []);
      this.isLoading.set(false);
    });
  }

  setFilter(type: 'video' | 'pdf'): void {
    this.filter.set(type);
  }

  openPdf(item: Content): void {
    let link = item.pdf_link || item.pdf_link2;
    if (link && !link.startsWith("http")) {
      link = this.crypto.decrypt(link);
    }
    if (link) {
        const pdfUrl = `${this.RENDER_PDF}${encodeURIComponent(link)}`;
        this.toast.show("Opening PDF...", "info");
        window.open(pdfUrl, "_blank");
    } else {
        this.toast.show("PDF link is invalid", "error");
    }
  }

  promptQuality(videoId: string, videoTitle: string): void {
    this.state.qualityModal.set({ open: true, videoId, videoTitle, batchId: this.batchId() });
  }

  get backLink(): string {
    return `/batch/${this.batchId()}/subject/${this.subjectId()}`;
  }
}
