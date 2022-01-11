import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private baseUrl = 'http://localhost:3000/api/thread';

  constructor(private http: HttpClient) {}

  getThreadLikes(id: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/' + id + '/like');
  }

  getCommentLikes(threadId: number, id: number): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + '/' + threadId + '/comments/' + id + '/like'
    );
  }

  getUserLikesOnThread(threadId: number, userId: string): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + '/' + threadId + '/like/' + userId
    );
  }

  getUserLikesOnComment(
    threadId: number,
    commentId: number,
    userId: string
  ): Observable<any> {
    return this.http.get<any>(
      this.baseUrl +
        '/' +
        threadId +
        '/comments/' +
        commentId +
        '/like/' +
        userId
    );
  }

  likeThread(threadId: number, value: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/' + threadId + '/like', {
      like: value,
    });
  }

  likeComment(
    threadId: number,
    commentId: number,
    value: number
  ): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + '/' + threadId + '/comments/' + commentId + '/like',
      {
        like: value,
      }
    );
  }
}
