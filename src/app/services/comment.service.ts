import { Injectable } from '@angular/core';
import {
  CreateCommentResponse,
  Comment,
  CommentResponse,
} from '../models/comment.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:3000/api/thread';

  constructor(private http: HttpClient) {}

  getAllComments(
    threadId: number,
    page: number,
    perPage: number
  ): Observable<CommentResponse> {
    const params = new HttpParams().set('page', page).set('npp', perPage);
    return this.http.get<CommentResponse>(
      this.baseUrl + '/' + threadId + '/comments',
      { params }
    );
  }

  getOneComment(commentId: number): Observable<any> {
    return this.http.get<Comment>(this.baseUrl + '/comments/' + commentId);
  }

  getCommentCount(threadId: number): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + '/' + threadId + '/comments/count'
    );
  }

  createComment(
    threadId: number,
    comment: Comment
  ): Observable<CreateCommentResponse> {
    return this.http.post<CreateCommentResponse>(
      this.baseUrl + '/' + threadId + '/comments',
      comment
    );
  }

  updateComment(
    id: number,
    threadId: number,
    comment: Comment
  ): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + '/' + threadId + '/comments/' + id,
      comment
    );
  }

  deleteComment(threadId: number, id: number): Observable<any> {
    return this.http.delete<any>(
      this.baseUrl + '/' + threadId + '/comments/' + id
    );
  }

  moderateComment(threadId: number, id: number): Observable<any> {
    return this.http.delete<any>(
      this.baseUrl + '/' + threadId + '/comments/' + id + '/moderate'
    );
  }
}
