// app/app.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ErrorService } from './services/error.service';
import { ErrorComponent } from './components/error/error.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ErrorComponent],
  template: `
    <app-error *ngIf="errorMessage" [message]="errorMessage"></app-error>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  private errorService = inject(ErrorService);
  errorMessage: string | null = null;

  constructor() {
    this.errorService.error$.subscribe((msg) => {
      this.errorMessage = msg;
    });
  }
}
