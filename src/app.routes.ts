
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'batches', pathMatch: 'full' },
  {
    path: 'batches',
    loadComponent: () => import('./pages/batches/batches.component').then(m => m.BatchesComponent)
  },
  {
    path: 'batch/:batchId',
    loadComponent: () => import('./pages/subjects/subjects.component').then(m => m.SubjectsComponent)
  },
  {
    path: 'batch/:batchId/subject/:subjectId',
    loadComponent: () => import('./pages/topics/topics.component').then(m => m.TopicsComponent)
  },
  {
    path: 'batch/:batchId/subject/:subjectId/topic/:topicId',
    loadComponent: () => import('./pages/content/content.component').then(m => m.ContentComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  { path: '**', redirectTo: 'batches' } 
];
