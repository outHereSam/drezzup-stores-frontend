import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {
  categoriesService = inject(CategoryService);
  private cartService = inject(CartService);
  cartCount = computed(() => this.cartService.getCartCount());

  categories$ = this.categoriesService.getCategories();
}
