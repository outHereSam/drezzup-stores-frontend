import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import {
  ProductModel,
  ProductModelResponse,
} from '../models/productModel.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductModelService {
  apiUrl = `${environment.apiUrl}/models`;

  constructor(private http: HttpClient) {}

  getModels(): Observable<ProductModel[]> {
    return this.http
      .get<ProductModelResponse>(this.apiUrl)
      .pipe(map((data) => data.product_models));
  }

  createModel(modelName: string) {
    return this.http.post(this.apiUrl, { model_name: modelName });
  }

  updateModel(model: ProductModel) {
    return this.http.put(`${this.apiUrl}/${model.product_model_id}`, {
      model_name: model.model_name,
      description: model.description,
    });
  }

  deleteModel(modelId: number) {
    return this.http.delete(`${this.apiUrl}/${modelId}`);
  }
}
