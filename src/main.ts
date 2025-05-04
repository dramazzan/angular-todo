import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, CanActivate } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/interceptors/auth.interceptors';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { AuthGuard } from './app/guards/auth.guard';

const routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./app/components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./app/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./app/components/dashboard/dashboard.component').then(
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
