import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContentType } from '../models/contentType.model';

@Injectable({
  providedIn: 'root',
})
export class ContentTypeService {
  private contentTypeUrl = 'http://localhost:3000/api/content/type';

  constructor(private http: HttpClient) {}

  getAllContentTypes(): Observable<ContentType[]> {
    return this.http.get<ContentType[]>(this.contentTypeUrl);
  }
}
