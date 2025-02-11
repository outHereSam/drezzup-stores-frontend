import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NOTYF } from '../../../shared/utils/notyf.token';
import { Notyf } from 'notyf';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../../../core/models/productModel.model';
import { ProductModelService } from '../../../core/services/product-model.service';

@Component({
  selector: 'app-models',
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './models.component.html',
  styleUrl: './models.component.sass',
})
export class ModelsComponent {
  private fb = inject(FormBuilder);
  private productModelService = inject(ProductModelService);
  models$!: Observable<ProductModel[]>;

  isOpened = false;
  isDeleteDialogOpened = false;
  selectedModel!: ProductModel | null;

  modelForm = this.fb.group({
    modelName: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(@Inject(NOTYF) private notyf: Notyf) {}

  ngOnInit(): void {
    this.loadModels();
  }

  loadModels() {
    this.models$ = this.productModelService.getModels();
  }

  openModelDialog(model?: ProductModel): void {
    this.selectedModel = model || null;
    if (model) {
      this.modelForm.patchValue({
        modelName: model.model_name,
      });
    } else {
      this.modelForm.reset();
    }
    this.isOpened = true;
  }

  closemodelDialog(): void {
    this.isOpened = false;
  }

  openDeleteDialog(model: ProductModel): void {
    this.selectedModel = model;
    this.isDeleteDialogOpened = true;
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpened = false;
  }

  onSubmit() {
    if (this.modelForm.valid) {
      const { modelName, description } = this.modelForm.value;

      if (this.selectedModel) {
        this.productModelService
          .updateModel({
            product_model_id: this.selectedModel.product_model_id,
            model_name: modelName as string,
            description: description as string,
          })
          .subscribe({
            next: () => {
              this.notyf.success('Category updated successfully');
              this.closemodelDialog();
              this.loadModels();
            },
            error: () =>
              this.notyf.error('An error occurred while updating the category'),
          });
      } else {
        this.productModelService.createModel(modelName as string).subscribe({
          next: () => {
            this.notyf.success('Category created successfully');
            this.closemodelDialog();
            this.loadModels();
          },
          error: () =>
            this.notyf.error('An error occurred while creating the category'),
        });
      }
    }
  }

  deleteModel() {
    if (this.selectedModel) {
      this.productModelService
        .deleteModel(this.selectedModel.product_model_id)
        .subscribe({
          next: () => {
            this.notyf.success('Category deleted successfully');
            this.closeDeleteDialog();
            this.loadModels();
          },
          error: () =>
            this.notyf.error('An error occurred while deleting the category'),
        });
    }
  }
}
