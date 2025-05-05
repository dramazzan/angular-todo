import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global Error:', error);
    alert('Something went wrong.');
  }
}
