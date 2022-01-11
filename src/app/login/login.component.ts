import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  errorMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.authService
      .login(
        this.loginForm.get('email')!.value,
        this.loginForm.get('password')!.value
      )
      .subscribe(
        (res) => this.loginSuccess(),
        (res) => this.loginError(res.error)
      );
  }

  loginSuccess(): void {
    this.router.navigate(['newsfeed']);
  }

  loginError(err: any): void {
    this.errorMessage = err.message;
  }
}
