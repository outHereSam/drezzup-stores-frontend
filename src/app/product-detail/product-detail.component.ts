import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ProductsService } from '../core/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Product, ProductVariant } from '../core/models/product.model';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../core/services/cart.service';
import { CartItem } from '../core/models/cart.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);

  quantity = signal(1);

  product$!: Observable<Product>;
  selectedVariant = signal<ProductVariant | null>(null);

  // Add a computed to check current cart quantity for selected variant
  cartQuantity = computed(() => {
    const variant = this.selectedVariant();
    if (!variant) return 0;

    const cartItems = this.cartService.getCartItems();
    const existingItem = cartItems.find(
      (item) => item.variant_id === variant.variant_id
    );
    return existingItem?.quantity || 0;
  });

  // Add a computed for remaining available quantity
  remainingStock = computed(() => {
    const variant = this.selectedVariant();
    if (!variant) return 0;
    return variant.quantity - this.cartQuantity();
  });

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const productId = Number(params.get('productId'));
        return this.productsService.getProductById(productId);
      })
    );
  }

  selectSize(variant: ProductVariant) {
    if (variant.quantity > 0) {
      this.selectedVariant.set(variant);
    }
  }

  addToCart(product: Product) {
    if (!this.selectedVariant()) {
      return;
    }

    const variant = this.selectedVariant()!;
    const cartItem: CartItem = {
      product_id: product.product_id,
      variant_id: variant.variant_id,
      brand_name: product.brand_name,
      model_name: product.model_name,
      color: variant.color,
      size: variant.size,
      price: product.price,
      quantity: this.quantity(),
      image: product.images[0],
      maxStock: variant.quantity,
    };

    this.cartService.addToCart(cartItem);
  }
}
