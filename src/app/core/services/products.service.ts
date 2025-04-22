import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Product, Tag } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  createProduct(product: FormData) {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(productId: number, productData: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, productData);
  }

  deleteProduct(productId: number) {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/tags`);
  }

  updateProductTag(payload: { product_id: number; tag_id: number | null }) {
    return this.http.patch(`${this.apiUrl}/${payload.product_id}/tag`, payload);
  }
}
