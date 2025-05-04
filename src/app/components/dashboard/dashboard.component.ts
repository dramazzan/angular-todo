
import { Component, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/model.user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, EditProfileComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  errorMessage: string = '';
  isModalOpen: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  closeModalWhenSuccess(status: boolean) {
    if(status) {
      this.isModalOpen = false;
      this.ngOnInit();
    }
  }

  logout() {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    this.router.navigate(['/login']);
  }

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