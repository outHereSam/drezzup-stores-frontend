import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Brand, BrandResponse } from '../models/brand.model';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  apiUrl = `${environment.apiUrl}/brands`;

  constructor(private http: HttpClient) {}

  getBrands(): Observable<Brand[]> {
    return this.http
      .get<BrandResponse>(this.apiUrl)
      .pipe(map((data) => data.brands));
  }

  createBrand(brandName: string) {
    return this.http.post(this.apiUrl, { brand_name: brandName });
  }

  updateBrand(brand: Brand) {
    return this.http.put(`${this.apiUrl}/${brand.brand_id}`, {
      brand_name: brand.brand_name,
    });
  }

  deleteBrand(brandId: number) {
    return this.http.delete(`${this.apiUrl}/${brandId}`);
  }
}
