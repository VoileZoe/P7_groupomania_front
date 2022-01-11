import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../models/credentials.model';
import { UserSession } from '../models/userSession.model';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<any>(this.authUrl + '/login', { email, password })
      .pipe(map((res) => this.setSession(res)));
  }

  signup(name: string, email: string, password: string) {
    return this.http
      .post<any>(this.authUrl + '/signup', { name, email, password })
      .pipe();
  }

  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expiresIn, 'hours');

    localStorage.setItem('user_id', authResult.userId);
    localStorage.setItem('user_role', authResult.role);
    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  isAdmin() {
    return localStorage.getItem('user_role') == 'admin';
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    if (!expiration) return null;
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getUserId() {
    return localStorage.getItem('user_id');
  }
}
