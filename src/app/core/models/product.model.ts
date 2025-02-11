export interface Product {
  product_id: number;
  category_id: number;
  category_name: string;
  brand_id: number;
  brand: string;
  product_model_id: number;
  model: string;
  description: string | null;
  price: number;
  variants: Variant[];
  images: string[] | null;
}

export interface Variant {
  attribute_combo_id: number;
  color: string | null;
  size: string | null;
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
