import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  @Input() message: string = '';

  constructor(private errorService: ErrorService) {}

  dismiss() {
    this.errorService.clearError();
  }
}
