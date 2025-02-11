export interface ProductModel {
  product_model_id: number;
  model_name: string;
  description: string;
}

export interface ProductModelResponse {
  product_models: ProductModel[];
}
