
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Topic } from '../../core/models/topic.model';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, PageHeaderComponent],
})
export class TopicsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  
  topics = signal<Topic[]>([]);
  isLoading = signal(true);
  batchId = signal('');
  subjectId = signal('');
  subjectName = signal(''); // Would need a way to fetch this

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bId = params.get('batchId');
      const sId = params.get('subjectId');
      if (bId && sId) {
        this.batchId.set(bId);
        this.subjectId.set(sId);
        this.subjectName.set(`Subject ${sId.slice(0, 6)}...`);
        this.fetchTopics(bId, sId);
      }
    });
  }

  fetchTopics(batchId: string, subjectId: string): void {
    this.isLoading.set(true);
    const endpoint = `/get/alltopicfrmlivecourseclass?courseid=${batchId}&subjectid=${subjectId}&start=-1`;
    this.api.apiCall<Topic[]>(endpoint).subscribe(res => {
      this.topics.set(res.data || []);
      this.isLoading.set(false);
    });
  }

  get backLink(): string {
    return `/batch/${this.batchId()}`;
  }
}
