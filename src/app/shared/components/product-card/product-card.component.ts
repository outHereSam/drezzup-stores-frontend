import { Component, effect, inject, input } from '@angular/core';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass',
})
export class ProductCardComponent {
  product = input<Product>();

  constructor() {}
}
