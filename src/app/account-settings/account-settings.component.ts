import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  userForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    newPassword: new FormControl(''),
    newPasswordVerif: new FormControl(''),
  });

  faArrowLeft = faArrowLeft;

  errorMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  back(): void {
    this.router.navigate(['newsfeed']);
  }

  updateUser(): void {
    const newPassword = this.userForm.get('newPassword')?.value;
    const newPasswordVerif = this.userForm.get('newPasswordVerif')?.value;

    if (newPassword != newPasswordVerif) {
      this.errorMessage =
        'Le nouveau mot de passe ne correspond pas à la validation';
      return;
    }

    const user = new User({
      name: this.userForm.get('username')?.value,
      email: this.userForm.get('email')?.value,
      password: newPassword,
    });

    this.userService.update(this.authService.getUserId()!, user).subscribe(
      (success) => this.router.navigate(['newsfeed']),
      (res) => {
        this.errorMessage = res.error.message;
      }
    );
  }
}
