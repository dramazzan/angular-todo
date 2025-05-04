import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { User } from '../../models/model.user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Output() userUpdated = new EventEmitter<boolean>();
  editForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      login: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.patchForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.patchForm();
    }
  }

  patchForm(): void {
    this.editForm.patchValue({
      name: this.user?.name,
      email: this.user?.email,
      login: this.user?.login,
    });
  }

  onSubmit() {
    if (this.editForm.invalid) return;

    this.userService.updateUser(this.editForm.value).subscribe({
      next: () => this.userUpdated.emit(true),
      error: (err) => {
        this.errorMessage = err.error.message || 'error updating user';
      },
    });
  }
}
