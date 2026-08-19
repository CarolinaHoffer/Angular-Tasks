import { Component, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { User } from '../../../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { EditUserModal } from '../edit-user-modal/edit-user-modal';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../../../../services/userService';
import { forkJoin } from 'rxjs';
import { ChangePasswordModal } from '../change-password-modal/change-password-modal';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-top-navbar',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltip
  ],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.css'
})
export class TopNavbar {
    user: User | null = null;
    constructor(
      private router: Router, 
      private dialog: MatDialog, 
      private userService: UserService, 
      private cdr: ChangeDetectorRef
    ) {}

    @Output() menuToggle = new EventEmitter<void>();

    ngOnInit(): void {
      this.getUser();
    }

    logout() {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    getUser(): void {
      this.userService.getMe().subscribe(user => {
        this.user = user;
        this.cdr.detectChanges();
      });
    }    

    toggleSideNavbar(): void {
      this.menuToggle.emit();
    }

    editUser(): void {
      if (!this.user) {
        return;
      }

      const dialogRef = this.dialog.open(EditUserModal, {
        width: '500px',
        data: {
          user: this.user
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        forkJoin({
          name: this.userService.updateFirstNameAndLastNameUser({
            firstName: result.firstName,
            lastName: result.lastName
          }),
          email: this.userService.updateEmailUser(
            result.email
          ) 
        }).subscribe({
          next: ({ name, email }) => {
            if (this.user) {
              this.user = {
                ...this.user,
                firstName: name.firstName,
                lastName: name.lastName,
                email: email.email
              };
            }
          this.cdr.detectChanges(); 
          },
          error: (error) => {
            console.error('Error editando tarea:', error);
          }
        });
      });
    }

    changePassword(): void {

    const dialogRef = this.dialog.open(ChangePasswordModal, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }

      this.userService.changePassword(
        result.currentPassword,
        result.newPassword
      ).subscribe({
        next: () => {
          console.log('Contraseña cambiada correctamente');
        },
        error: (error) => {
          console.error('Error cambiando contraseña:', error);
        }
      });
    });
  }
}