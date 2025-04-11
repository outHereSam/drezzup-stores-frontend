import { Component, inject, Output, EventEmitter, Inject } from '@angular/core';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../../core/services/category.service';
import { BrandService } from '../../../../core/services/brand.service';
import { Category } from '../../../../core/models/category.model';
import { Brand } from '../../../../core/models/brand.model';
import { ProductsService } from '../../../../core/services/products.service';
import { Notyf } from 'notyf';
import { NOTYF } from '../../../../shared/utils/notyf.token';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, ImageUploaderComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.sass',
})
export class ProductFormComponent {
  categoryService = inject(CategoryService);
  brandService = inject(BrandService);
  productsService = inject(ProductsService);
  fb: FormBuilder = inject(FormBuilder);
  @Output() closeProductDialogEvent = new EventEmitter<boolean>();

  isOpened = false;

  categories: Category[] = [];
  brands: Brand[] = [];
  uploadedFiles: File[] = [];

  constructor(@Inject(NOTYF) private notyf: Notyf) {}

  productForm: FormGroup = this.fb.group({
    category: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    color: ['', [Validators.required, Validators.maxLength(50)]],
    size: ['', [Validators.required, Validators.maxLength(20)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
  }

  private loadCategories() {
    this.categoryService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  private loadBrands() {
    this.brandService.getBrands().subscribe((brands) => (this.brands = brands));
  }

  private loadProducts() {
    this.productsService.getProducts().subscribe();
  }

  closeProductDialog(): void {
    this.closeProductDialogEvent.emit(false);
    this.productForm.reset();
  }

  onFilesChanged(files: File[]) {
    this.uploadedFiles = files;
  }

  onSubmit(): void {
    if (this.productForm.valid && this.uploadedFiles.length > 0) {
      const formData = new FormData();

      formData.append('category', this.productForm.value.category);
      formData.append('brand', this.productForm.value.brand);
      formData.append('model', this.productForm.value.model);
      formData.append('color', this.productForm.value.color);
      formData.append('size', this.productForm.value.size);
      formData.append('description', this.productForm.value.description);
      formData.append('quantity', this.productForm.value.quantity);
      formData.append('price', this.productForm.value.price);

      // Append image files (if you allow multiple, loop through them)
      this.uploadedFiles.forEach((file, index) => {
        formData.append('images', file); // 'images' is the field name used by Multer on backend
      });

      this.productsService.createProduct(formData).subscribe({
        next: (response) => {
          this.notyf.success('Product created successfully!');
          this.closeProductDialog();
          // TODO: load products here
          this.loadProducts();
        },
        error: (error) => {
          this.notyf.error('Failed to create product');
        },
      });
    } else {
      // console.log('Form is invalid');
      this.productForm.markAllAsTouched();
    }
  }
}
