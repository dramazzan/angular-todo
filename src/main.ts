import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/interceptors/auth.interceptors';
import { ErrorInterceptor } from './app/interceptors/error.interceptor'; // <- добавить
import { DashboardComponent } from './app/components/profile/dashboard/dashboard.component';
import { AuthGuard } from './app/guards/auth.guard';
import { AdminGuard } from './app/guards/admin.guard';
import { GlobalErrorHandler } from './app/handlers/global-error.handler';

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
        () => DashboardComponent
      ),
    canActivate: [AuthGuard],
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
  { path: '', redirectTo: 'login', pathMatch: 'full' as const },
  { path: '**', redirectTo: 'login', pathMatch: 'full' as const },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, 
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
}).catch((err) => console.error(err));
