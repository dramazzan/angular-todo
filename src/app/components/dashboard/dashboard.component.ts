import { Component, OnInit } from '@angular/core';
import { User } from '../../models/model.user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.dashboard().subscribe({
      next: (data) => {
        this.user = data.user;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ошибка при загрузке данных пользователя';
      }
    });
  }
}
