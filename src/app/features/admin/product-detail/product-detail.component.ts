import {
  Component,
  effect,
  HostListener,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import {
  Product,
  ProductVariant,
  Tag,
} from '../../../core/models/product.model';
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
import { BrandService } from '../../../core/services/brand.service';
import { Brand } from '../../../core/models/brand.model';
import { NOTYF } from '../../../shared/utils/notyf.token';
import { Notyf } from 'notyf';

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
  private brandService = inject(BrandService);
  private fb = inject(FormBuilder);

  selectedId!: number;
  product$!: Observable<Product>;
  isOptionsOpened: boolean = false;
  isEditModalOpen = false;
  product!: Product;
  editProductForm!: FormGroup;
  brands: Brand[] = [];
  tags: Tag[] = [];

  readonly ChevronLeft = ChevronLeft;
  readonly Trash2Icon = Trash2Icon;
  readonly EllipsisIcon = EllipsisIcon;
  readonly PencilIcon = PencilIcon;
  readonly CircleXIcon = CircleXIcon;

  constructor(@Inject(NOTYF) private notyf: Notyf) {}

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

    this.brandService.getBrands().subscribe((brands) => (this.brands = brands));

    this.productsService.getTags().subscribe((tags) => {
      this.tags = tags;
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

      const payload = {
        product_id: this.selectedId,
        category: this.product.category_id, // Keep existing category
        brand: this.product.brand_id, // Keep existing brand
        product_model_id: this.product.product_model_id, // Keep existing model ID
        price: updatedProduct.price,
        model_name: updatedProduct.model_name,
        model_description: updatedProduct.model_description,
        variants: updatedProduct.variants.map((variant: any) => ({
          variant_id: variant.variant_id || null,
          color: variant.color,
          size: variant.size,
          quantity: variant.quantity,
        })),
      };

      console.log('Payload to send to the backend:', payload);

      // Call the service to update the product
      this.productsService.updateProduct(this.selectedId, payload).subscribe({
        next: (updatedProduct) => {
          // Close the modal
          this.notyf.success('Product updated successfully');
          this.closeEditModal();

          // Refresh the product data by recalling the method that fetches the product data
          this.refreshProductData();
        },
        error: (error) => {
          this.notyf.error('Error updating product');
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // Method to refresh the product data
  refreshProductData(): void {
    // Re-fetch the product data
    this.product$ = this.productsService.getProductById(this.selectedId);

    // Update the local product data when the new data arrives
    this.product$.subscribe((product) => {
      this.product = product;
      this.initForm();
    });
  }

  toggleTag(tagName: string, isChecked: boolean): void {
    // Find the tag ID dynamically based on the tag name
    const tag = this.tags.find((t) => t.tag_name === tagName);
    const tagId = isChecked ? tag?.tag_id : null;

    if (tagId === undefined) {
      this.notyf.error(`Tag "${tagName}" not found.`);
      return;
    }

    const payload = {
      product_id: this.selectedId,
      tag_id: tagId,
    };

    this.productsService.updateProductTag(payload).subscribe({
      next: () => {
        this.notyf.success(`${tagName} status updated successfully.`);
        this.refreshProductData();
      },
      error: (error) => {
        console.error(`Error updating ${tagName} tag:`, error);
        this.notyf.error(`Failed to update ${tagName} status.`);
      },
    });
  }
}
