
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CommonModule],
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  backLink = input<string>();
  backText = input<string>();
}
