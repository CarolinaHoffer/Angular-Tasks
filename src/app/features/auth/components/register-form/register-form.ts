import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { UserService } from '../../../../services/userService';

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCardContent,
    MatIconModule,
  ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css'
})
export class RegisterForm {

  ngOnInit(): void {
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }
  constructor(
    private userService: UserService
  ) {}

  isLoading = false;

  @Output() registerSuccess = new EventEmitter<void>();
  @Output() backToLogin = new EventEmitter<void>();

  passwordMatchValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {

    const password = this.registerForm?.controls.password.value;
    const confirmPassword = control.value;
    if (!confirmPassword) {
      return null;
    }
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),

    lastName: new FormControl('', Validators.required),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),

    confirmPassword: new FormControl('', [
      Validators.required,
      this.passwordMatchValidator
    ])
  });



  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const request = {
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!
    };
    this.userService.createUser(request).subscribe({
      next: (user) => {
        console.log('Usuario creado:', user);

        this.isLoading = false;
        this.registerSuccess.emit();
      },
      error: (error) => {
        console.error('Error creando usuario:', error);

        this.isLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.backToLogin.emit();
  }
}