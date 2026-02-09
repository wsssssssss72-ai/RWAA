
import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class HeaderComponent {
  state = inject(StateService);
  router = inject(Router);

  clock = input.required<string>();
  
  profile = this.state.profile;
  avatarUrl = computed(() => {
    const name = this.profile()?.name;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'User')}&backgroundColor=0a0a0f`;
  });

  searchBatches(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.router.navigate(['/batches'], { queryParams: { q: input.value } });
  }
}
