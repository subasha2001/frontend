import { Injectable } from '@angular/core';
import { Cart } from '../shared/models/cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { jewelleryType } from '../shared/models/productType';
import { CartItem } from '../shared/models/cartItems';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();

  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor() {}

  addToCart(product: jewelleryType): void {
    let cartItem = this.cart.items.find(
      (item) => item.product.id == product.id
    );
    if (cartItem) return;

    this.cart.items.push(new CartItem(product));
    this.setCartToLocalStorage();
  }

  removeFromCart(productId: string): void {
    this.cart.items = this.cart.items.filter(
      (item) => item.product.id != productId
    );
    this.setCartToLocalStorage();
  }

  changeQuanity(productId: string, quantity: number) {
    let cartItem = this.cart.items.
    find((item) => item.product.id === productId);
    if (!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = cartItem.product.price * quantity;
    this.setCartToLocalStorage();
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }
  getCart(): Cart {
    return this.cartSubject.value;
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);

    this.cart.totalCount = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);

    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocalStorage(){
    if (typeof localStorage !== 'undefined') {
      const cartJson = localStorage.getItem('Cart');
      return cartJson ? JSON.parse(cartJson) : new Cart();
    }
  }
}