export interface Category {
  category_id: number;
  category_name: string;
}

export interface CategoryResponse {
  categories: Category[];
}
