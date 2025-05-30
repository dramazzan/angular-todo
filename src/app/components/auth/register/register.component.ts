import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      agreeToTerms: [false, Validators.requiredTrue] // Добавлено поле согласия
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Помечаем все поля как touched для отображения ошибок
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = ''; // Очищаем предыдущие ошибки

    // Убираем agreeToTerms из данных для отправки на сервер
    const { agreeToTerms, ...formData } = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response) => {
        // Можно автоматически войти после регистрации или перенаправить на логин
        if (response.token) {
          // Автоматический вход после регистрации
          this.authService.setToken(response.token);
          this.router.navigate(['/dashboard']);
        } else {
          // Перенаправление на страницу входа
          this.router.navigate(['/login']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ошибка регистрации, проверьте введенные данные';
        this.isLoading = false;
      },
    });
  }

  // Метод для переключения видимости пароля
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Методы для социальной регистрации
  registerWithGoogle(): void {
    this.isLoading = true;
    // Здесь будет логика регистрации через Google
    // Например, через Google OAuth или Firebase Auth
    console.log('Register with Google');
    
    // Пример реализации:
    // this.authService.registerWithGoogle().subscribe({
    //   next: (response) => {
    //     this.authService.setToken(response.token);
    //     this.router.navigate(['/dashboard']);
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     this.errorMessage = 'Ошибка регистрации через Google';
    //     this.isLoading = false;
    //   }
    // });
    
    // Временно убираем загрузку для демонстрации
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  registerWithGithub(): void {
    this.isLoading = true;
    // Здесь будет логика регистрации через GitHub
    console.log('Register with GitHub');
    
    // Пример реализации:
    // this.authService.registerWithGithub().subscribe({
    //   next: (response) => {
    //     this.authService.setToken(response.token);
    //     this.router.navigate(['/dashboard']);
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     this.errorMessage = 'Ошибка регистрации через GitHub';
    //     this.isLoading = false;
    //   }
    // });
    
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onFieldChange(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  getPasswordStrength(): string {
    const password = this.password?.value || '';
    let strength = 0;

    // Проверяем различные критерии
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    if (strength <= 1) return 'weak';
    if (strength <= 2) return 'fair';
    if (strength <= 3) return 'good';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    const texts = {
      weak: 'Слабый пароль',
      fair: 'Средний пароль',
      good: 'Хороший пароль',
      strong: 'Сильный пароль'
    };
    return texts[strength as keyof typeof texts];
  }

  // Вспомогательный метод для пометки всех полей формы как touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Геттеры для удобного доступа к полям формы в шаблоне
  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get login() {
    return this.registerForm.get('login');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get agreeToTerms() {
    return this.registerForm.get('agreeToTerms');
  }
}