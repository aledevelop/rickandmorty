import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'character/:character_id',
    loadComponent: () => import('./pages/character/character.component')
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/grilla/grilla.component')
  }
];
