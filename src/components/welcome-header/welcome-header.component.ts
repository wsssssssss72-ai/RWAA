
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-welcome-header',
  templateUrl: './welcome-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeHeaderComponent {
  name = input.required<string | null>();
  batchCount = input.required<number>();
}
