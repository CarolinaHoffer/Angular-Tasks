import { Component } from '@angular/core';
import { LoginForm } from '../components/login-form/login-form';
import { SidePanel } from '../components/side-panel/side-panel';
import { RegisterForm } from '../components/register-form/register-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [LoginForm, SidePanel, RegisterForm],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  isLoggedIn = false;
  showRegister = false;

  constructor(private router: Router) {}
  
  onLoginSuccess() {
      this.isLoggedIn = true;
          setTimeout(() => {
            this.router.navigate(['/home']);

      }, 1100);
  }
  
}