export interface Product {
  product_id: number;
  brand_name: string;
  model_name: string;
  category_name: string;
  model_description: string;
  price: number;
  images: string[];
  variants: ProductVariant[];
  category_id: number;
  brand_id: number;
  tag_name: string;
  product_model_id: number;
}

export interface ProductVariant {
  variant_id: number;
  product_id: number;
  color: string;
  size: string;
  quantity: number;
}

export interface ProductResponse {
  id: number;
  category_id: number;
  combo_id: number;
  product_brand_id: number;
  product_model_id: number;
  price: number;
  quantity: number;
}

export interface Tag {
  tag_id: number;
  tag_name: string;
}
