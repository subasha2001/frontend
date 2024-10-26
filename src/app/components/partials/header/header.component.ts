import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';
import { SearchComponent } from '../search/search.component';
import { Category } from '../../../shared/models/categories';
import { CommonModule } from '@angular/common';
import { metalType } from '../../../shared/models/metalType';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../services/user.service';
import { CartService } from '../../../services/cart.service';
import { rates } from '../../../shared/models/rates';
import { GoldSilverService } from '../../../services/gold-silver.service';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, SearchComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  products!: jewelleryType[];
  metalType?: metalType[];
  categories?: Category[];
  GR22!: number;
  GR24!: number;
  GR18!: number;
  user!: User;
  admin!: User;
  silver!: number;
  gst!: number;
  cartQuantity!: number;
  rates!: any;
  baseurl = BASE_URL;

  constructor(
    service: ProductsService,
    private userService: UserService,
    private GR: GoldSilverService,
    cartservice: CartService,
    actRoute: ActivatedRoute
  ) {
    service.getAllProducts().subscribe((Products) => {
      this.products = Products;
    });

    service.getAllMetalType().subscribe((serverMetalType) => {
      this.metalType = serverMetalType;
    });

    service.getAllCategory().subscribe((serveCategories) => {
      this.categories = serveCategories;
    });

    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    this.userService.adminObservable.subscribe((Admin) => {
      this.admin = Admin;
    });

    cartservice.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart?.totalCount;
    });

    actRoute.params.subscribe((params) => {
      let ratesObservable: Observable<rates[]> = this.GR.getRatesFromDB();
      ratesObservable.subscribe((Items) => {
        Items.forEach((val) => {
          this.GR18 = val.gold18;
          this.GR22 = val.gold22;
          this.GR24 = val.gold24;
          this.silver = val.silver;
          this.gst = val.gst;
        });
      });
    });
  }
  logout() {
    this.userService.logout();
  }
  adminLogout() {
    this.userService.adminLogout();
  }
  get isAuth() {
    return this.user.name;
  }
  get isAdminAuth() {
    return this.admin.name;
  }
  showNav!: boolean;
  toggleMenu(val: boolean) {
    this.showNav = val;
  }
}
