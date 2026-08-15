import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCardContent,
    MatIconModule,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  constructor(private authService: AuthService) {}
  isLoading = false;

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();


  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });


  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const request = {
    email: this.loginForm.value.email!,
    password: this.loginForm.value.password!
  };

  this.authService.login(request).subscribe({
    next: (token) => {
      console.log('Login correcto');
      console.log('JWT:', token);
      sessionStorage.setItem('token', token);
      this.isLoading = false;
      this.loginSuccess.emit();
    },
    error: (error) => {
      console.error('Error de login:', error);

      this.isLoading = false;
    }
  });
    



  }
}