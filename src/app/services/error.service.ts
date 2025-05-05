import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  setError(message: string) {
    this.errorSubject.next(message);
  }

  clearError() {
    this.errorSubject.next(null);
  }
}
