import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http
      .get<CategoryResponse>(this.apiUrl)
      .pipe(map((data) => data.categories));
  }

  getCategoryByCategoryName(categoryName: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${categoryName}`);
  }

  createCategory(categoryName: string) {
    return this.http.post(this.apiUrl, { category_name: categoryName });
  }

  updateCategory(category: Category) {
    return this.http.put(`${this.apiUrl}/${category.category_id}`, {
      category_name: category.category_name,
    });
  }

  deleteCategory(categoryId: number) {
    return this.http.delete(`${this.apiUrl}/${categoryId}`);
  }
}
