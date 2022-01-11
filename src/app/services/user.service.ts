import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.userUrl + '/' + id);
  }

  create(user: User): Observable<any> {
    return this.http.post<any>(this.userUrl, user);
  }

  update(id: string, user: User): Observable<any> {
    return this.http.put<any>(this.userUrl + '/' + id, user);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(this.userUrl + '/' + id);
  }
}
