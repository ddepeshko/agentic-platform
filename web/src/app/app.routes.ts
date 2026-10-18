import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'playground' },
  {
    path: 'playground',
    loadComponent: () =>
      import('./features/playground/playground.component').then((m) => m.PlaygroundComponent),
  },
];
