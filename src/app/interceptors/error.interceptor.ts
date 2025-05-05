import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private errorService: ErrorService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Server error';
          this.errorService.setError(message);
          return throwError(() => error);
        })
      );
    }
    

}
