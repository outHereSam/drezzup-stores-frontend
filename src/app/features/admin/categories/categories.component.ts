import { Component, Inject, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { NOTYF } from '../../../shared/utils/notyf.token';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-categories',
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.sass',
})
export class CategoriesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  categories$!: Observable<Category[]>;

  isOpened = false;
  isDeleteDialogOpened = false;
  selectedCategory!: Category | null;

  categoryForm = this.fb.group({
    categoryName: ['', Validators.required],
  });

  constructor(@Inject(NOTYF) private notyf: Notyf) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categories$ = this.categoryService.getCategories();
  }

  openCategoryDialog(category?: Category): void {
    this.selectedCategory = category || null;
    if (category) {
      this.categoryForm.patchValue({
        categoryName: category.category_name,
      });
    } else {
      this.categoryForm.reset();
    }
    this.isOpened = true;
  }

  closeCategoryDialog(): void {
    this.isOpened = false;
  }

  openDeleteDialog(category: Category): void {
    this.selectedCategory = category;
    this.isDeleteDialogOpened = true;
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpened = false;
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const { categoryName } = this.categoryForm.value;

      if (this.selectedCategory) {
        this.categoryService
          .updateCategory({
            category_id: this.selectedCategory.category_id,
            category_name: categoryName as string,
          })
          .subscribe({
            next: () => {
              this.notyf.success('Category updated successfully');
              this.closeCategoryDialog();
              this.loadCategories();
            },
            error: () =>
              this.notyf.error('An error occurred while updating the category'),
          });
      } else {
        this.categoryService.createCategory(categoryName as string).subscribe({
          next: () => {
            this.notyf.success('Category created successfully');
            this.closeCategoryDialog();
            this.loadCategories();
          },
          error: () =>
            this.notyf.error('An error occurred while creating the category'),
        });
      }
    }
  }

  deleteCategory() {
    if (this.selectedCategory) {
      this.categoryService
        .deleteCategory(this.selectedCategory.category_id)
        .subscribe({
          next: () => {
            this.notyf.success('Category deleted successfully');
            this.closeDeleteDialog();
            this.loadCategories();
          },
          error: () =>
            this.notyf.error('An error occurred while deleting the category'),
        });
    }
  }
}
