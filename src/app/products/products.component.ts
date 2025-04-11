import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../core/models/product.model';
import { ProductsService } from '../core/services/products.service';
import { CategoryService } from '../core/services/category.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { ProductCardComponent } from '../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.sass',
})
export class ProductsComponent implements OnInit {
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);

  products$!: Observable<Product[]>;
  categoryName!: string | null;
  categoryId!: number;

  ngOnInit(): void {
    this.products$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const categoryName = params.get('categoryName');
        if (!categoryName) {
          console.error('Category name is required');
          return [];
        }

        return this.categoryService
          .getCategoryByCategoryName(categoryName)
          .pipe(
            switchMap((category) => {
              if (!category?.category_id) {
                console.error('Category not found or invalid');
                return [];
              }

              this.categoryName = categoryName;
              this.categoryId = category.category_id;

              return this.productsService.getProductsByCategoryId(
                category.category_id
              );
            })
          );
      })
    );
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/products', this.categoryName, productId]);
  }
}
