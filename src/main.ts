import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, CanActivate } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/interceptors/auth.interceptors';
import { DashboardComponent } from './app/components/profile/dashboard/dashboard.component';
import { AuthGuard } from './app/guards/auth.guard';
import { AdminGuard } from './app/guards/admin.guard';

const routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./app/components/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./app/components/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./app/components/profile/dashboard/dashboard.component').then(
        (m) => DashboardComponent
      ),
      canActivate:[AuthGuard]
  },
  {
    path: 'cases',
    loadComponent: () =>
      import('./app/components/case/case-list/case-list.component').then(
        (m) => m.CaseListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./app/components/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' as 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' as 'full' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
}).catch((err) => console.error(err));
