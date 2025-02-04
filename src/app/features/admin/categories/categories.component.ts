import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-categories',
  imports: [ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.sass',
})
export class CategoriesComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  isOpened = false;

  categoryForm = this.fb.group({
    categoryName: ['', Validators.required],
  });

  openCategoryDialog(): void {
    this.isOpened = true;
  }

  closeCategoryDialog(): void {
    this.isOpened = false;
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const { categoryName } = this.categoryForm.value;
      this.categoryService.createCategory(categoryName as string).subscribe({
        next: (response) => console.log(response),
        error: (error) => console.error(error),
      });
    }
  }
}
