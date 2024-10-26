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
  GR22!: number;
  GR24!: number;
  GR18!: number;
  SR!: number;
  gst!: number;

  constructor(
    private cartservice: CartService,
    private GS: GoldSilverService,
    actRoute: ActivatedRoute
  ) {
    actRoute.params.subscribe((params) => {
      let ratesObservable: Observable<rates[]> = this.GS.getRatesFromDB();
      ratesObservable.subscribe((Items) => {
        Items.forEach((val) => {
          this.GR18 = val.gold18;
          this.GR22 = val.gold22;
          this.GR24 = val.gold24;
          this.SR = val.silver;
          this.gst = val.gst;
        });
      });
    });

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
