import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  createCategory(categoryName: string) {
    return this.http.post(this.apiUrl, { category_name: categoryName });
  }
}
