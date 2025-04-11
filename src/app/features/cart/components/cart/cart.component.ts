import { Component, effect, inject } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.sass',
})
export class CartComponent {
  public cartService = inject(CartService);

  constructor() {
    effect(() => {
      console.log(this.cartService.getCartItems());
    });
  }

  updateQuantity(variantId: number, newQuantity: number) {
    if (newQuantity === 0) {
      this.cartService.removeItem(variantId);
    } else {
      this.cartService.updateQuantity(variantId, newQuantity);
    }
  }
}
