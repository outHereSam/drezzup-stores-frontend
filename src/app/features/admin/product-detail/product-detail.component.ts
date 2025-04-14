import { Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { ProductsService } from '../../../core/services/products.service';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ChevronLeft,
  Trash2Icon,
  EllipsisIcon,
  PencilIcon,
  CircleXIcon,
} from 'lucide-angular';
import { ZeroPadPipe } from '../../../shared/pipes/zero-pad.pipe';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ZeroPadPipe,
    RouterLink,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);

  selectedId!: number;
  product$!: Observable<Product>;
  isOptionsOpened: boolean = false;
  isEditModalOpen = false;
  product!: Product;
  editProductForm!: FormGroup;

  readonly ChevronLeft = ChevronLeft;
  readonly Trash2Icon = Trash2Icon;
  readonly EllipsisIcon = EllipsisIcon;
  readonly PencilIcon = PencilIcon;
  readonly CircleXIcon = CircleXIcon;

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = Number(params.get('productId'));
        return this.productsService.getProductById(this.selectedId);
      })
    );
    this.product$.subscribe((product) => {
      this.product = product;
      this.initForm();
    });
  }

  initForm(): void {
    this.editProductForm = this.fb.group({
      brand_name: [this.product?.brand_name || '', Validators.required],
      model_name: [this.product?.model_name || '', Validators.required],
      model_description: [
        this.product?.model_description || '',
        Validators.required,
      ],
      price: [
        this.product?.price || 0,
        [Validators.required, Validators.min(0)],
      ],
      variants: this.fb.array([]), // Initialize as an empty array
    });

    // Populate the variants if the product data is available
    if (this.product?.variants) {
      const variantsArray = this.product.variants.map((variant) =>
        this.createVariantGroup(variant)
      );
      this.editProductForm.setControl('variants', this.fb.array(variantsArray));
    }
  }

  get variants(): FormArray {
    return this.editProductForm.get('variants') as FormArray;
  }

  createVariantGroup(
    variant: any = { color: '', size: '', quantity: 0 }
  ): FormGroup {
    return this.fb.group({
      color: [variant.color, Validators.required],
      size: [variant.size, Validators.required],
      quantity: [variant.quantity, [Validators.required, Validators.min(0)]],
    });
  }

  addVariant(): void {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  openEditModal(): void {
    this.isEditModalOpen = true;
    this.isOptionsOpened = false;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  toggleOptions(): void {
    this.isOptionsOpened = !this.isOptionsOpened;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.options') && !target.closest('.menu_options')) {
      this.isOptionsOpened = false;
    }
  }

  updateProduct(): void {
    if (this.editProductForm.valid) {
      const updatedProduct = this.editProductForm.value;
      console.log('Updated product:', updatedProduct);

      // Perform the update logic here (e.g., send the updated data to the server)
      // this.product = { ...updatedProduct };

      // Close the modal
      // this.closeEditModal();
    } else {
      console.log('Form is invalid');
    }
  }
}
