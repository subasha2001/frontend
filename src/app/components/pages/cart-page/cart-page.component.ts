import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Cart } from '../../../shared/models/cart';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../shared/models/cartItems';
import { TitleComponent } from '../../partials/title/title.component';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from '../../partials/page-not-found/page-not-found.component';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { map, Observable } from 'rxjs';
import { rates } from '../../../shared/models/rates';
import { jewelleryType } from '../../../shared/models/productType';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    TitleComponent,
    CommonModule,
    PageNotFoundComponent,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent implements OnInit {
  cart!: Cart;
  baseurl = BASE_URL;

  constructor(
    private cartservice: CartService
  ) {
    cartservice.getCartObservable().subscribe((Cart) => {
      this.cart = Cart;
    });
  }
  ngOnInit(): void {}

  removeFromCart(cartItem: CartItem) {
    this.cartservice.removeFromCart(cartItem.product.id);
  }

  changeQuantity(cartItem: CartItem, quantityInString: string) {
    const quantity = parseInt(quantityInString);
    this.cartservice.changeQuanity(cartItem.product.id, quantity);
  }
}
