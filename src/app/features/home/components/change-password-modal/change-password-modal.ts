import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-change-password-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './change-password-modal.html',
  styleUrl: './change-password-modal.css'
})
export class ChangePasswordModal {

  ngOnInit(): void {
    this.passwordForm.controls.newPassword.valueChanges.subscribe(() => {
      this.passwordForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  passwordMatchValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {

    const password = this.passwordForm?.controls.newPassword.value;
    const confirmPassword = control.value;
    if (!confirmPassword) {
      return null;
    }
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),

    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

    confirmPassword: new FormControl('', [
      Validators.required,
      this.passwordMatchValidator
    ])
  });

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordModal>
  ) {}

  submit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const newPassword = this.passwordForm.controls.newPassword.value;
    const confirmPassword = this.passwordForm.controls.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      this.passwordForm.controls.confirmPassword.setErrors({
        passwordMismatch: true
      });

      return;
    }

    this.dialogRef.close({
      currentPassword: this.passwordForm.controls.currentPassword.value ?? '',
      newPassword: newPassword ?? ''
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}