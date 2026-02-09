
import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly PROFILE_KEY = 'spidy_profile';
  private readonly FAVORITES_KEY = 'spidy_favs';

  private safeParse<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}"`, e);
      return null;
    }
  }

  getProfile(): Profile | null {
    return this.safeParse<Profile>(this.PROFILE_KEY);
  }

  saveProfile(profile: Profile): void {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  getFavorites(): string[] {
    return this.safeParse<string[]>(this.FAVORITES_KEY) || [];
  }

  saveFavorites(favs: string[]): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favs));
  }

  clearAllData(): void {
    localStorage.clear();
  }
}
