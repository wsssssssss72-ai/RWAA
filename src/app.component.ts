
import { Component, ChangeDetectionStrategy, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { StateService } from './core/services/state.service';
import { LocalStorageService } from './core/services/local-storage.service';

import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { SetupScreenComponent } from './components/setup-screen/setup-screen.component';
import { HeaderComponent } from './components/header/header.component';
import { MobileNavComponent } from './components/mobile-nav/mobile-nav.component';
import { ToastComponent } from './components/toast/toast.component';
import { DeveloperModalComponent } from './components/developer-modal/developer-modal.component';
import { EditProfileModalComponent } from './components/edit-profile-modal/edit-profile-modal.component';
import { WaModalComponent } from './components/wa-modal/wa-modal.component';
import { QualityModalComponent } from './components/quality-modal/quality-modal.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    LoadingScreenComponent,
    SetupScreenComponent,
    HeaderComponent,
    MobileNavComponent,
    ToastComponent,
    DeveloperModalComponent,
    EditProfileModalComponent,
    WaModalComponent,
    QualityModalComponent,
    VideoPlayerComponent
  ],
})
export class AppComponent implements OnInit {
  private state = inject(StateService);
  private localStorage = inject(LocalStorageService);
  private router = inject(Router);

  isShowingSplash = signal(true);
  needsSetup = signal(false);
  isAppReady = signal(false);

  clock = signal(new Date().toLocaleTimeString('en-US', { hour12: false }));

  constructor() {
    effect(() => {
      const profile = this.state.profile();
      if (profile) {
        this.needsSetup.set(false);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
        window.scrollTo(0, 0);
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('splashShown') === 'true') {
      this.isShowingSplash.set(false);
      this.runAppInitialization();
    } else {
      setTimeout(() => {
        this.isShowingSplash.set(false);
        sessionStorage.setItem('splashShown', 'true');
        this.runAppInitialization();
      }, 3000); // Splash screen duration
    }

    setInterval(() => {
      this.clock.set(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
  }

  private runAppInitialization(): void {
    const profile = this.localStorage.getProfile();
    if (!profile) {
      this.needsSetup.set(true);
    } else {
      this.state.setProfile(profile);
      this.initApp();
    }
  }

  finishSetup(name: string): void {
    const newProfile = { name, bio: "Quantum System User" };
    this.state.setProfile(newProfile);
    this.localStorage.saveProfile(newProfile);
    this.needsSetup.set(false);
    this.initApp();
  }
  
  initApp(): void {
    this.isAppReady.set(true);
    // Navigate to batches only if not already there, to avoid issues on startup
    if (this.router.url === '/') {
       this.router.navigate(['/batches']);
    }
  }
}
