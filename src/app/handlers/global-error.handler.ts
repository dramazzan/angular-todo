import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorService } from '../services/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

 constructor(private errorService: ErrorService) {}

handleError(error: any): void {
  const message = error.message || 'Unexpected error';
  this.errorService.setError(message);
  console.error('Global error:', error);
}

}
