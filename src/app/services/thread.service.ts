import { Injectable } from '@angular/core';
import {
  CreateThreadResponse,
  Thread,
  ThreadResponse,
} from '../models/thread.model';
import { finalize, Observable, Subscription } from 'rxjs';
import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private threadUrl = 'http://localhost:3000/api/thread';

  constructor(private http: HttpClient) {}

  getAllThreads(page: number, perPage: number): Observable<ThreadResponse> {
    const params = new HttpParams().set('page', page).set('npp', perPage);
    return this.http.get<ThreadResponse>(this.threadUrl, { params });
  }

  getAllThreadsByCategory(
    page: number,
    perPage: number,
    category: number
  ): Observable<ThreadResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('npp', perPage)
      .set('categoryId', category);
    return this.http.get<ThreadResponse>(this.threadUrl, { params });
  }

  getOneThread(id: number): Observable<Thread> {
    return this.http.get<Thread>(this.threadUrl + '/' + id);
  }

  createThread(thread: Thread, img: any): Observable<CreateThreadResponse> {
    const formData = new FormData();
    formData.append('thread', JSON.stringify(thread));
    if (img) {
      formData.append('image', img);
    }
    return this.http.post<CreateThreadResponse>(this.threadUrl, formData);
  }

  updateThread(id: number, thread: Thread, img: any): Observable<any> {
    const formData = new FormData();
    formData.append('thread', JSON.stringify(thread));
    if (img) {
      formData.append('image', img);
    }
    return this.http.put<any>(this.threadUrl + '/' + id, formData);
  }

  deleteThread(id: number): Observable<any> {
    return this.http.delete<any>(this.threadUrl + '/' + id);
  }

  moderateThread(id: number): Observable<any> {
    return this.http.delete<any>(this.threadUrl + '/' + id + '/moderate');
  }
}
