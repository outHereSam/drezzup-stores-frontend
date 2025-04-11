import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  constructor() {}

  addToCart(item: CartItem) {
    const currentCart = this.cartItems();
    const existingItem = currentCart.find(
      (i) =>
        i.product_id === item.product_id && i.variant_id === item.variant_id
    );

    if (existingItem) {
      this.cartItems.set(
        currentCart.map((i) =>
          i.variant_id === item.variant_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      );
    } else {
      this.cartItems.set([...currentCart, item]);
    }
  }

  getCartItems() {
    return this.cartItems();
  }

  getCartCount() {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  updateQuantity(variantId: number, newQuantity: number) {
    const currentCart = this.cartItems();
    this.cartItems.set(
      currentCart.map((item) =>
        item.variant_id === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }

  removeItem(variantId: number) {
    const currentCart = this.cartItems();
    this.cartItems.set(
      currentCart.filter((item) => item.variant_id !== variantId)
    );
  }
}
