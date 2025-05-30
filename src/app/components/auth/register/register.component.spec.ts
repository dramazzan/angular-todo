import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'setToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        CommonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.registerForm.get('name')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
      expect(component.registerForm.get('login')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
      expect(component.registerForm.get('agreeToTerms')?.value).toBe(false);
    });

    it('should have required validators', () => {
      const nameControl = component.registerForm.get('name');
      const emailControl = component.registerForm.get('email');
      const loginControl = component.registerForm.get('login');
      const passwordControl = component.registerForm.get('password');
      const agreeToTermsControl = component.registerForm.get('agreeToTerms');

      nameControl?.setValue('');
      emailControl?.setValue('');
      loginControl?.setValue('');
      passwordControl?.setValue('');
      agreeToTermsControl?.setValue(false);

      expect(nameControl?.hasError('required')).toBeTruthy();
      expect(emailControl?.hasError('required')).toBeTruthy();
      expect(loginControl?.hasError('required')).toBeTruthy();
      expect(passwordControl?.hasError('required')).toBeTruthy();
      expect(agreeToTermsControl?.hasError('required')).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should validate password minimum length', () => {
      const passwordControl = component.registerForm.get('password');
      
      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('minlength')).toBeTruthy();
      
      passwordControl?.setValue('123456');
      expect(passwordControl?.hasError('minlength')).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Заполняем форму валидными данными
      component.registerForm.patchValue({
        name: 'Test User',
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123',
        agreeToTerms: true
      });
    });

    it('should call authService.register on valid form submission', () => {
      const mockResponse = { token: 'mock-token' };
      authService.register.and.returnValue(of(mockResponse));

      component.onSubmit();

      expect(authService.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123'
      });
    });

    it('should set token and navigate to dashboard on successful registration', () => {
      const mockResponse = { token: 'mock-token' };
      authService.register.and.returnValue(of(mockResponse));

      component.onSubmit();

      expect(authService.setToken).toHaveBeenCalledWith('mock-token');
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle registration error', () => {
      const mockError = { error: { message: 'Registration failed' } };
      authService.register.and.returnValue(throwError(() => mockError));

      component.onSubmit();

      expect(component.errorMessage).toBe('Registration failed');
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle registration error without message', () => {
      const mockError = { error: {} };
      authService.register.and.returnValue(throwError(() => mockError));

      component.onSubmit();

      expect(component.errorMessage).toBe('Ошибка регистрации, попробуйте еще раз');
      expect(component.isLoading).toBeFalsy();
    });

    it('should not submit if form is invalid', () => {
      component.registerForm.patchValue({
        name: '',
        email: 'invalid-email',
        login: '',
        password: '123',
        agreeToTerms: false
      });

      component.onSubmit();

      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.registerForm.patchValue({
        name: '',
        email: '',
        login: '',
        password: '',
        agreeToTerms: false
      });

      component.onSubmit();

      expect(component.registerForm.get('name')?.touched).toBeTruthy();
      expect(component.registerForm.get('email')?.touched).toBeTruthy();
      expect(component.registerForm.get('login')?.touched).toBeTruthy();
      expect(component.registerForm.get('password')?.touched).toBeTruthy();
      expect(component.registerForm.get('agreeToTerms')?.touched).toBeTruthy();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBeFalsy();
      
      component.togglePasswordVisibility();
      expect(component.showPassword).toBeTruthy();
      
      component.togglePasswordVisibility();
      expect(component.showPassword).toBeFalsy();
    });

    it('should change input type when password visibility is toggled', () => {
      const passwordInput = fixture.debugElement.query(By.css('#password'));
      
      expect(passwordInput.nativeElement.type).toBe('password');
      
      component.togglePasswordVisibility();
      fixture.detectChanges();
      
      expect(passwordInput.nativeElement.type).toBe('text');
    });
  });

  describe('Password Strength', () => {
    it('should return "weak" for short passwords', () => {
      component.registerForm.get('password')?.setValue('123');
      expect(component.getPasswordStrength()).toBe('weak');
    });

    it('should return "fair" for passwords with basic requirements', () => {
      component.registerForm.get('password')?.setValue('password');
      expect(component.getPasswordStrength()).toBe('fair');
    });

    it('should return "good" for passwords with mixed case and numbers', () => {
      component.registerForm.get('password')?.setValue('Password123');
      expect(component.getPasswordStrength()).toBe('good');
    });

    it('should return "strong" for complex passwords', () => {
      component.registerForm.get('password')?.setValue('Password123!');
      expect(component.getPasswordStrength()).toBe('strong');
    });

    it('should return correct strength text', () => {
      component.registerForm.get('password')?.setValue('123');
      expect(component.getPasswordStrengthText()).toBe('Слабый пароль');

      component.registerForm.get('password')?.setValue('password');
      expect(component.getPasswordStrengthText()).toBe('Средний пароль');

      component.registerForm.get('password')?.setValue('Password123');
      expect(component.getPasswordStrengthText()).toBe('Хороший пароль');

      component.registerForm.get('password')?.setValue('Password123!');
      expect(component.getPasswordStrengthText()).toBe('Сильный пароль');
    });
  });

  describe('Social Registration', () => {
    it('should handle Google registration', () => {
      spyOn(console, 'log');
      
      component.registerWithGoogle();
      
      expect(console.log).toHaveBeenCalledWith('Register with Google');
      expect(component.isLoading).toBeTruthy();
    });

    it('should handle GitHub registration', () => {
      spyOn(console, 'log');
      
      component.registerWithGithub();
      
      expect(console.log).toHaveBeenCalledWith('Register with GitHub');
      expect(component.isLoading).toBeTruthy();
    });
  });

  describe('Field Change Handler', () => {
    it('should clear error message when field changes', () => {
      component.errorMessage = 'Some error';
      
      component.onFieldChange();
      
      expect(component.errorMessage).toBe('');
    });

    it('should not affect error message if it is empty', () => {
      component.errorMessage = '';
      
      component.onFieldChange();
      
      expect(component.errorMessage).toBe('');
    });
  });

  describe('Form Getters', () => {
    it('should return correct form controls', () => {
      expect(component.name).toBe(component.registerForm.get('name'));
      expect(component.email).toBe(component.registerForm.get('email'));
      expect(component.login).toBe(component.registerForm.get('login'));
      expect(component.password).toBe(component.registerForm.get('password'));
      expect(component.agreeToTerms).toBe(component.registerForm.get('agreeToTerms'));
    });
  });

  describe('Template Integration', () => {
    it('should display error messages for invalid fields', () => {
      component.registerForm.get('name')?.setValue('');
      component.registerForm.get('name')?.markAsTouched();
      component.registerForm.get('email')?.setValue('invalid-email');
      component.registerForm.get('email')?.markAsTouched();
      
      fixture.detectChanges();
      
      const errorElements = fixture.debugElement.queryAll(By.css('.error-text'));
      expect(errorElements.length).toBeGreaterThan(0);
    });

    it('should disable submit button when form is invalid', () => {
      component.registerForm.patchValue({
        name: '',
        email: '',
        login: '',
        password: '',
        agreeToTerms: false
      });
      
      fixture.detectChanges();
      
      const submitButton = fixture.debugElement.query(By.css('.register-button'));
      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.registerForm.patchValue({
        name: 'Test User',
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123',
        agreeToTerms: true
      });
      
      fixture.detectChanges();
      
      const submitButton = fixture.debugElement.query(By.css('.register-button'));
      expect(submitButton.nativeElement.disabled).toBeFalsy();
    });

    it('should show loading message when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const loadingMessage = fixture.debugElement.query(By.css('.loading-message'));
      expect(loadingMessage).toBeTruthy();
      expect(loadingMessage.nativeElement.textContent.trim()).toContain('Создание аккаунта...');
    });

    it('should show error message when errorMessage is set', () => {
      component.errorMessage = 'Test error message';
      fixture.detectChanges();
      
      const errorMessage = fixture.debugElement.query(By.css('.error-message'));
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.nativeElement.textContent.trim()).toContain('Test error message');
    });

    it('should show password strength indicator when password has value', () => {
      component.registerForm.get('password')?.setValue('password123');
      fixture.detectChanges();
      
      const strengthIndicator = fixture.debugElement.query(By.css('.password-strength'));
      expect(strengthIndicator).toBeTruthy();
    });

    it('should call togglePasswordVisibility when password toggle button is clicked', () => {
      spyOn(component, 'togglePasswordVisibility');
      
      const toggleButton = fixture.debugElement.query(By.css('.password-toggle'));
      toggleButton.nativeElement.click();
      
      expect(component.togglePasswordVisibility).toHaveBeenCalled();
    });

    it('should call registerWithGoogle when Google button is clicked', () => {
      spyOn(component, 'registerWithGoogle');
      
      const googleButton = fixture.debugElement.query(By.css('.social-button.google'));
      googleButton.nativeElement.click();
      
      expect(component.registerWithGoogle).toHaveBeenCalled();
    });

    it('should call registerWithGithub when GitHub button is clicked', () => {
      spyOn(component, 'registerWithGithub');
      
      const githubButton = fixture.debugElement.query(By.css('.social-button.github'));
      githubButton.nativeElement.click();
      
      expect(component.registerWithGithub).toHaveBeenCalled();
    });

    it('should call onFieldChange when input value changes', () => {
      spyOn(component, 'onFieldChange');
      
      const nameInput = fixture.debugElement.query(By.css('#name'));
      nameInput.nativeElement.value = 'Test';
      nameInput.nativeElement.dispatchEvent(new Event('input'));
      
      expect(component.onFieldChange).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should set loading state during form submission', () => {
      const mockResponse = { token: 'mock-token' };
      authService.register.and.returnValue(of(mockResponse));
      
      component.registerForm.patchValue({
        name: 'Test User',
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123',
        agreeToTerms: true
      });
      
      expect(component.isLoading).toBeFalsy();
      
      component.onSubmit();
      
      expect(component.isLoading).toBeFalsy(); // Should be false after successful completion
    });

    it('should disable social buttons when loading', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const googleButton = fixture.debugElement.query(By.css('.social-button.google'));
      const githubButton = fixture.debugElement.query(By.css('.social-button.github'));
      
      expect(googleButton.nativeElement.disabled).toBeTruthy();
      expect(githubButton.nativeElement.disabled).toBeTruthy();
    });
  });
});