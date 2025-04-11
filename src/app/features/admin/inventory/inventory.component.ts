import { CommonModule } from '@angular/common';
import { Component, Inject, inject, model, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Product } from '../../../core/models/product.model';
import { ImageUploaderComponent } from '../components/image-uploader/image-uploader.component';
import { Observable } from 'rxjs';
import { Category } from '../../../core/models/category.model';
import { Brand } from '../../../core/models/brand.model';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';
import { ProductFormComponent } from '../components/product-form/product-form.component';
import { ProductsService } from '../../../core/services/products.service';
import { NOTYF } from '../../../shared/utils/notyf.token';
import { Notyf } from 'notyf';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inventory',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    LoaderComponent,
    ProductFormComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.sass',
})
export class InventoryComponent implements OnInit {
  categoryService = inject(CategoryService);
  brandService = inject(BrandService);
  productsService = inject(ProductsService);

  isOpened = false;
  isDeleteDialogOpened = false;
  selectedProduct!: Product | null;
  isLoading = false;

  products: Product[] = [];

  constructor(@Inject(NOTYF) private notyf: Notyf) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => console.error('Failed to fetch products:', error),
    });
  }

  openProductDialog(product?: Product): void {
    this.selectedProduct = product || null;
    this.isOpened = true;
  }

  closeDialog(close: boolean) {
    this.isOpened = close;
  }

  deleteProduct(productId: number) {
    this.productsService.deleteProduct(productId).subscribe({
      next: () => this.notyf.success('Product deleted successfully.'),
      error: (error) => this.notyf.error('Failed to delete product'),
    });
  }
}
