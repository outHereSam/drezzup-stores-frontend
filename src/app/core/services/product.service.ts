import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  updateProduct(
    productId: number,
    productData: Partial<Product>
  ): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${productId}`, productData);
  }

  addProductVariant(
    productId: number,
    variantData: Partial<Product['variants'][0]>
  ): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiUrl}/${productId}/variants`,
      variantData
    );
  }

  updateProductVariant(
    productId: number,
    variantId: number,
    variantData: Partial<Product['variants'][0]>
  ): Observable<Product> {
    return this.http.patch<Product>(
      `${this.apiUrl}/${productId}/variants/${variantId}`,
      variantData
    );
  }

  deleteProductVariant(
    productId: number,
    variantId: number
  ): Observable<Product> {
    return this.http.delete<Product>(
      `${this.apiUrl}/${productId}/variants/${variantId}`
    );
  }

  addProductImage(productId: number, imageFile: File): Observable<Product> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<Product>(
      `${this.apiUrl}/${productId}/images`,
      formData
    );
  }

  deleteProductImage(productId: number, imageUrl: string): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/${productId}/images`, {
      body: { imageUrl },
    });
  }
}
