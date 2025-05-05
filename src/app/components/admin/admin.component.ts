import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/model.user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  users: User[] = []
  errorMessage: string = ""

  constructor(private adminService: AdminService) {
    
  }

  handleDelete(userId: string){
    this.adminService.deleteUser(userId).subscribe({
      next: ()=>{
        this.ngOnInit()
      },
      error: err =>{
        this.errorMessage = err.error.message || "Error deleting user"
      }
    })
  }

  ngOnInit(): void {
    this.adminService.getUsers().subscribe({
      next: (data: any)=>{
        this.users = data.users
      }
    })
  }
}
