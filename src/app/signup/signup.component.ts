import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
    passwordVerif: new FormControl(null, [Validators.required]),
  });
  errorMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  submitted = false;

  signup(): void {
    this.submitted = true;
    if (
      this.signupForm.get('password')!.value !=
      this.signupForm.get('passwordVerif')!.value
    ) {
      this.errorMessage = 'Les mots de passe entrés ne sont pas identiques';
      return;
    }
    if (this.signupForm.invalid) {
      this.errorMessage = 'Votre email est incorrect !';
      return;
    }
    this.authService
      .signup(
        this.signupForm.get('username')!.value,
        this.signupForm.get('email')!.value,
        this.signupForm.get('password')!.value
      )
      .subscribe(
        () => this.signupSuccess(),
        (res) => this.signupError(res.error)
      );
  }

  signupSuccess(): void {
    this.submitted = false;
    if (confirm('Votre compte a bien été créé !')) {
      this.router.navigate(['login']);
    }
  }

  signupError(err: any): void {
    this.errorMessage = err.message;
  }
}
