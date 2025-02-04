import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Observable } from 'rxjs';
import { NOTYF } from '../../../shared/utils/notyf.token';
import { Notyf } from 'notyf';
import { BrandService } from '../../../core/services/brand.service';
import { Brand } from '../../../core/models/brand.model';

@Component({
  selector: 'app-brands',
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.sass',
})
export class BrandsComponent {
  private fb = inject(FormBuilder);
  private brandService = inject(BrandService);
  brands$!: Observable<Brand[]>;

  isOpened = false;
  isDeleteDialogOpened = false;
  selectedBrand!: Brand | null;

  brandForm = this.fb.group({
    brandName: ['', Validators.required],
  });

  constructor(@Inject(NOTYF) private notyf: Notyf) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.brands$ = this.brandService.getBrands();
  }

  openBrandDialog(brand?: Brand): void {
    this.selectedBrand = brand || null;
    if (brand) {
      this.brandForm.patchValue({
        brandName: brand.brand_name,
      });
    } else {
      this.brandForm.reset();
    }
    this.isOpened = true;
  }

  closeBrandDialog(): void {
    this.isOpened = false;
  }

  openDeleteDialog(brand: Brand): void {
    this.selectedBrand = brand;
    this.isDeleteDialogOpened = true;
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpened = false;
  }

  onSubmit() {
    if (this.brandForm.valid) {
      const { brandName } = this.brandForm.value;

      if (this.selectedBrand) {
        this.brandService
          .updateBrand({
            brand_id: this.selectedBrand.brand_id,
            brand_name: brandName as string,
          })
          .subscribe({
            next: () => {
              this.notyf.success('Category updated successfully');
              this.closeBrandDialog();
              this.loadBrands();
            },
            error: () =>
              this.notyf.error('An error occurred while updating the category'),
          });
      } else {
        this.brandService.createBrand(brandName as string).subscribe({
          next: () => {
            this.notyf.success('Category created successfully');
            this.closeBrandDialog();
            this.loadBrands();
          },
          error: () =>
            this.notyf.error('An error occurred while creating the category'),
        });
      }
    }
  }

  deleteBrand() {
    if (this.selectedBrand) {
      this.brandService.deleteBrand(this.selectedBrand.brand_id).subscribe({
        next: () => {
          this.notyf.success('Category deleted successfully');
          this.closeDeleteDialog();
          this.loadBrands();
        },
        error: () =>
          this.notyf.error('An error occurred while deleting the category'),
      });
    }
  }
}
