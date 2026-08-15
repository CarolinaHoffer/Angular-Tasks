import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login';
import { Home } from './features/home/pages/home';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'home',
        canActivate: [authGuard],
        component: Home
    },
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
