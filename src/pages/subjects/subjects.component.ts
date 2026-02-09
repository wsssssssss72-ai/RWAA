
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Subject } from '../../core/models/subject.model';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, PageHeaderComponent],
})
export class SubjectsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  
  subjects = signal<Subject[]>([]);
  isLoading = signal(true);
  batchId = signal('');
  batchName = signal(''); // Would need a way to fetch this or pass it via state

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('batchId');
      if (id) {
        this.batchId.set(id);
        // In a real app, you'd fetch the batch name here or get it from state
        this.batchName.set(`Batch ${id.slice(0, 6)}...`); 
        this.fetchSubjects(id);
      }
    });
  }

  fetchSubjects(batchId: string): void {
    this.isLoading.set(true);
    const endpoint = `/get/allsubjectfrmlivecourseclass?courseid=${batchId}&start=-1`;
    this.api.apiCall<Subject[]>(endpoint).subscribe(res => {
      this.subjects.set(res.data || []);
      this.isLoading.set(false);
    });
  }
}
